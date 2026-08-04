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

  logout = async(req: Request , res: Response)=>{

    const result = await authService.logout(req.user.id, req.body)

    return res.status(200).json({
      success : true,
      message: "User Logged out successfully",
    })
  }

  logoutAll = async (req: Request, res: Response)=>{

    const result = await authService.logoutAll(req.user.id)

    return res.status(200).json({
      success: true,
      message:"Logged out from all devices"
    })
  }
}

export const authController = new AuthController();
