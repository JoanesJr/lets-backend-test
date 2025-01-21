import { CustomerRepository } from "../repositories/CustomerRepostory";
import { Customer } from "../models/Customer";

export class GetCustomerByIdUseCase {
    constructor(private readonly repository: CustomerRepository) { }

    async execute(id: string): Promise<Customer | null> {
        const item = await this.repository.getCustomerById(id);
        return item || null;
    }
}