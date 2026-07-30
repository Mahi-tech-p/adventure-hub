import { AppError } from "./AppError.js";


export class BadRequestError extends AppError {
    constructor(message = "bad request") {
        super(message, 400)
    }
}