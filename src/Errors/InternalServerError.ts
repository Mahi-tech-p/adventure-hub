import { AppError } from "./AppError.js";


export class InternalServerError extends AppError{
    constructor(messsage = "InternalServerError") {
        super(messsage,500)
    }
}