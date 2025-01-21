import {
  DynamoDBClient,
  PutItemCommand,
  CreateTableCommand,
  DeleteTableCommand,
  ScalarAttributeType,
  KeyType,
  GetItemCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Customer } from "src/models/Customer";

console.log("process.env.NODE_ENV ", process.env.NODE_ENV)

const isLocal = process.env.NODE_ENV === "test" || process.env.NODE_ENV == "dev";

export class DynamoDBService {
  private tableName: string;
  private client: DynamoDBClient;

  constructor() {
    this.tableName = process.env.CUSTOMERS_TABLE || "CustomersTable";
    this.client = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      endpoint: isLocal ? "http://localhost:8000" : undefined,
    });
  }

  async createItem(item: object) {
    if (isLocal) {
      await this.verifyTables();
    }
    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(item, { convertClassInstanceToMap: true }),
      })
    );
  }

  async createTable(): Promise<void> {
    try {
      const params = {
        TableName: this.tableName,
        KeySchema: [
          {
            AttributeName: "customerId",
            KeyType: KeyType.HASH,
          },
        ],
        AttributeDefinitions: [
          {
            AttributeName: "customerId",
            AttributeType: ScalarAttributeType.S,
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      };

      const command = new CreateTableCommand(params);
      await this.client.send(command);
      console.log(`Table "${this.tableName}" created successfully.`);
    } catch (error: any) {
      if (error.name === "ResourceInUseException") {
        console.log(`Table "${this.tableName}" already exists.`);
      } else {
        console.error(`Error creating table "${this.tableName}":`, error);
        throw error;
      }
    }
  }

  async deleteTable(): Promise<void> {
    try {
      const command = new DeleteTableCommand({ TableName: this.tableName });
      await this.client.send(command);
      console.log(`Table "${this.tableName}" deleted successfully.`);
    } catch (error: any) {
      if (error.name === "ResourceNotFoundException") {
        console.log(`Table "${this.tableName}" does not exist.`);
      } else {
        console.error(`Error deleting table "${this.tableName}":`, error);
        throw error;
      }
    }
  }

  async getItemById(customerId: string): Promise<Customer | null> {
    try {
      const command = new GetItemCommand({
        TableName: this.tableName,
        Key: marshall({ customerId }),
      });

      const response = await this.client.send(command);

      if (response.Item) {
        return unmarshall(response.Item) as Customer;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching item with ID "${customerId}":`, error);
      throw error;
    }
  }

  async listTables(): Promise<string[]> {
    try {
      const command = new ListTablesCommand({});
      const response = await this.client.send(command);
      console.log("Tables in DynamoDB:", response.TableNames || []);
      return response.TableNames || [];
    } catch (error) {
      console.error("Error listing tables:", error);
      return [];
    }
  }

  async verifyTables() {
    const tables = await this.listTables();
    if (!tables.includes(this.tableName)) {
      await this.createTable();
    }
  }
}
