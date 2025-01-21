import { CustomerRepository } from "../src/repositories/CustomerRepostory";
import { DynamoDBService } from "../src/services/DynamoDBService";

jest.mock("../src/services/DynamoDBService");


describe("CustomerRepository", () => {
    it("should call DynamoDBService.createItem with the correct parameters", async () => {
      const mockCreateItem = jest.fn();
      const mockDbService = { createItem: mockCreateItem } as unknown as DynamoDBService;
  
      const repository = new CustomerRepository(mockDbService);
  
      const customer = { customerId: "1", fullName: "Joanes Lebarch", birthDate: "2002-04-30", isActive: true, addresses: [], contacts: [] };
      await repository.createCustomer(customer);
  
      expect(mockCreateItem).toHaveBeenCalledWith(customer);
    });
  });