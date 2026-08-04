import { Request, Response } from "express";

import { authService } from "./auth.service.js";
import { success } from "zod";

export class AuthController {
  register = async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: result,
    });
  };

  login = async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      message: "Logined SucessFully",
      data: result,
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    const result = await authService.refreshToken(req.body.refreshToken);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
      data: result,
    });
  };

  me = async(req: Request, res: Response)=>{
    const result =  await authService.me(req.user.id)
    
    return res.status(200).json({
      success:true,
      message:"User fetched Successfully",
      data: result
    })
  }
}

export const authController = new AuthController();
