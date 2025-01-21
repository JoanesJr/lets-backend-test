import { ValidationError } from "./Validation.error";

export class MissingFieldsError extends ValidationError {
    constructor(entity: string, fields: string[]) {
        super();
        this.message = `${entity} Missing required fields: ${fields.join(', ')}`
    }
}