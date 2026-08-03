import { Request, Response } from "express";

import { authService } from "./auth.service.js";

export class AuthController {
  register = async (
    req: Request,
    res: Response
  ) => {
    const result = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: result,
    });
  };
}

export const authController = new AuthController();