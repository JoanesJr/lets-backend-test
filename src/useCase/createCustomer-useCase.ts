import { Address, Contact, Customer } from "../models/Customer";
import { CustomerRepository } from "../repositories/CustomerRepostory";
import { v4 as uuid } from "uuid";
import { MissingFieldsError } from "./errors/MissingFieldsError";
import { ContactPrimaryMissingError } from "./errors/ContactPrimaryMissing.error";
import { InvalidFormatError } from "./errors/InvalidFormatError";

export class CreateCostumerUseCase {
    constructor(private readonly repository: CustomerRepository) { }

    async execute(body: Omit<Customer, 'customerId'>): Promise<Customer> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        if (
            !body.fullName ||
            !body.birthDate ||
            !body.addresses ||
            body.addresses.length === 0 ||
            !body.contacts ||
            body.contacts.length === 0
        ) {
            throw new MissingFieldsError('', Object.keys(body))
        }

        body.addresses.forEach((address: Address) => {
            if (!address.street || !address.neighborhood || !address.number || !address.city || !address.postalCode) {
                throw new MissingFieldsError("Address", Object.keys(Address));
            }
        });
        body.contacts.forEach((contact: Contact) => {
            if (!contact.email || !contact.phone || !contact.isPrimary) {
                throw new MissingFieldsError("Contact", Object.keys(Address));
            }
            if (!emailRegex.test(contact.email)) {
                throw new InvalidFormatError("email");
            }
        });

        if (!body.contacts.some((contact: Contact) => contact.isPrimary)) {
            throw new ContactPrimaryMissingError();

        }

        const customer = new Customer({ customerId: uuid(), ...body });
        await this.repository.createCustomer(customer);
        return customer;
    }
}