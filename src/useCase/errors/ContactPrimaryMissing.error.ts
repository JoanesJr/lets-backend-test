import { ValidationError } from "./Validation.error";

export class ContactPrimaryMissingError extends ValidationError {
    constructor() {
        super();
        this.message = "At least one contact must be marked as primary";
    }
}