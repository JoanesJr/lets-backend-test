import { APIGatewayProxyHandler } from "aws-lambda";
import { Customer } from "../models/Customer";
import { makeCreateCustomer } from "../useCase/factories/make-createCustomer-factory";
import { ValidationError } from "../useCase/errors/Validation.error";


export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is missing" }),
      };
    }

    const body = JSON.parse(event.body) as Omit<Customer, 'customerId'>;
    const createCustomerUseCase = makeCreateCustomer();
    const dataRes = await createCustomerUseCase.execute(body);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Customer created successfully",
        customer: dataRes,
      }),
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify(error.message)
      }
    }

    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify('Ocurred an internal error')
    }
  }
};
