import { AppError } from "./AppError.js";

export class ForbiddenError extends AppError{
    constructor(message = "ForbiddenError") {
        super(message,403)
    }
}