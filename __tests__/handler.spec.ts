import { handler } from "../src/handlers/createCustomer";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { makeCreateCustomer } from "../src/useCase/factories/make-createCustomer-factory";

jest.mock("../src/useCase/factories/make-createCustomer-factory");

describe("CreateCustomerHandler", () => {
  const mockExecute = jest.fn();
  const mockUseCase = { execute: mockExecute };

  beforeAll(() => {
    (makeCreateCustomer as jest.Mock).mockReturnValue(mockUseCase);
  });

  const mockContext = {} as Context; 
  const mockCallback = jest.fn(); 

  it("should return 400 if body is missing", async () => {
    const event = {} as APIGatewayProxyEvent; 

    const result = await handler(event, mockContext, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400); 
  });

  it("should return 201 if customer is created successfully", async () => {
    mockExecute.mockResolvedValue({ customerId: "1", fullName: "Joanes Lebarch" }); 

    const event = {
      body: JSON.stringify({
        fullName: "Joanes Lebarch",
        birthDate: "2002-04-30",
        isActive: true,
        addresses: [{ street: "Rua A", postalCode: "12345", neighborhood: "Centro", number: "100", city: "São Paulo" }],
        contacts: [{ email: "email@email.com", phone: "123456789", isPrimary: false }]
      }),
    } as APIGatewayProxyEvent;

    const result = await handler(event, mockContext, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(201); 
  });
});
