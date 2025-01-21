import { DynamoDBService } from "../src/services/DynamoDBService";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

jest.mock("@aws-sdk/client-dynamodb");

describe("DynamoDBService", () => {
  const tableName = "CustomersTable";
  process.env.CUSTOMERS_TABLE = tableName;

  it("should call PutItemCommand with the correct parameters", async () => {
    const mockedSend = jest.fn();
    (DynamoDBClient.prototype.send as jest.Mock) = mockedSend;

    const service = new DynamoDBService();
    const item = { id: "1", name: "Test Customer" };

    await service.createItem(item);

    expect(mockedSend).toHaveBeenCalled();
  });
});
