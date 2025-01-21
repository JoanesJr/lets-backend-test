import { CreateCostumerUseCase } from "../src/useCase/createCustomer-useCase";
import { GetCustomerByIdUseCase } from "../src/useCase/getCustomerById-useCase";
import { CustomerRepository } from "../src/repositories/CustomerRepostory";
import { MissingFieldsError } from "../src/useCase/errors/MissingFieldsError";
import { DynamoDBService } from "../src/services/DynamoDBService";
import { InvalidFormatError } from "../src/useCase/errors/InvalidFormatError";

const dynamoDbService = new DynamoDBService();
const customerRepository = new CustomerRepository(dynamoDbService);
const sut = new CreateCostumerUseCase(customerRepository);
const sutGetCustomerById = new GetCustomerByIdUseCase(customerRepository);

beforeAll(async () => {
  await dynamoDbService.createTable();
});

afterAll(async () => {
  await dynamoDbService.deleteTable();
});

describe("CreateCustomerUseCase", () => {

  it("should throw MissingFieldsError if required fields are missing", async () => {
    const customer = {
      fullName: "Joanes Lebarch",
      birthDate: "2002-04-30",
      addresses: [],
      contacts: []
    };

    await expect(sut.execute(customer as any)).rejects.toThrow(MissingFieldsError);
  });
  it("should throw MissingFieldsError if addresses is missing", async () => {
    const customer = {
      fullName: "Joanes Lebarch",
      birthDate: "2002-04-30",
      addresses: [],
      contacts: [{ email: "email@email.com", phone: "123456789", isPrimary: false }]
    };

    await expect(sut.execute(customer as any)).rejects.toThrow(MissingFieldsError);
  });
  it("should throw MissingFieldsError if contacts is missing", async () => {
    const customer = {
      fullName: "Joanes Lebarch",
      birthDate: "2002-04-30",
      addresses: [{ street: "Rua A", postalCode: "12345", neighborhood: "Centro", number: "100", city: "São Paulo" }],
      contacts: []
    };

    await expect(sut.execute(customer as any)).rejects.toThrow(MissingFieldsError);
  });
  it("should throw ContactPrimaryMissingError if required fields are missing", async () => {
    const customer = {
      fullName: "Joanes Lebarch",
      birthDate: "2002-04-30",
      isActive: true,
      addresses: [{ street: "Rua A", postalCode: "12345", neighborhood: "Centro", number: "100", city: "São Paulo" }],
      contacts: [{ email: "email@email.com", phone: "123456789", isPrimary: false }]
    };

    await expect(sut.execute(customer as any)).rejects.toThrow(MissingFieldsError);
  });
  it("should throw InvalidFormatError if email is invalid", async () => {
    const customer = {
      fullName: "Joanes Lebarch",
      birthDate: "2002-04-30",
      isActive: true,
      addresses: [{ street: "Rua A", postalCode: "12345", neighborhood: "Centro", number: "100", city: "São Paulo" }],
      contacts: [{ email: "email", phone: "123456789", isPrimary: true }]
    };

    await expect(sut.execute(customer as any)).rejects.toThrow(InvalidFormatError);
  });

  it("should create a customer successfully if all validations pass", async () => {
    const customer = {
      fullName: "Joanes Lebarch",
      birthDate: "2002-04-30",
      isActive: true,
      addresses: [{ street: "Rua A", postalCode: "12345", neighborhood: "Centro", number: "100", city: "São Paulo" }],
      contacts: [{ email: "email@email.com", phone: "123456789", isPrimary: true }]
    };

    const result = await sut.execute(customer as any);
    const getItem = await sutGetCustomerById.execute(result.customerId)

    expect(result.customerId).toBeDefined();
    expect(getItem).toEqual(result)
  });
});
