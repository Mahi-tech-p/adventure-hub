
import { Request, Response, NextFunction } from "express";
import { authService , AuthService} from "./auth.service.js";

export class AuthController{
        constructor(
        private readonly authService: AuthService
    ) {}
  register= async(
    req: Request,
    res: Response,
    next: NextFunction
 )=>{
    try {
        const result =  await authService.register(req.body)
        return res.status(201).json({
            success: true,
            message:"User Created Successfully..",
            date: result
        })
    } catch (error) {
        next(error)
    }
 }   
}

export const authController = new AuthController(authService)