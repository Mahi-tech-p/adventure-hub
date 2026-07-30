import { AppError } from "./AppError.js";


export class ConflictError extends AppError{
    constructor(message = "ConflictError") {
        super(message,409)
    }
}