export class ValidationError extends Error {
    public statusCode: number;
    constructor() {
        super();
        this.statusCode = 400;
    }
}