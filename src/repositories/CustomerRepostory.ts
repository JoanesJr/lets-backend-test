import { DynamoDBService } from "../services/DynamoDBService";
import { Customer } from "../models/Customer";

export class CustomerRepository {
  constructor(private readonly dbService: DynamoDBService) {}

  async createCustomer(customer: Customer) {
    await this.dbService.createItem(customer);
  }

  async getCustomerById (id: string): Promise<Customer | null> {
    return await this.dbService.getItemById(id);
  }
}
