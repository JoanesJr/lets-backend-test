import { ValidationError } from "./Validation.error";

export class InvalidFormatError extends ValidationError {
    constructor(field: string) {
        super();
        this.message = `Invalid format field: ${field}}`
    }
}