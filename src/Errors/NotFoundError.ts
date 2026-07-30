import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
    constructor(message = "NotFound") {
        super(message,404)
    }
}