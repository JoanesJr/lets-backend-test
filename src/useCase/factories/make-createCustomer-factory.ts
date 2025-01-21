import { CustomerRepository } from "../../repositories/CustomerRepostory"
import { CreateCostumerUseCase } from "../createCustomer-useCase"
import { DynamoDBService } from "../../services/DynamoDBService";

export const makeCreateCustomer = () => {
    const dynamoDb = new DynamoDBService();
    const repository = new CustomerRepository(dynamoDb);
    const useCase = new CreateCostumerUseCase(repository);
    return useCase;
}