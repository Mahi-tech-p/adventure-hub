import { Request, Response } from "express";
import { userService } from "./user.service.js";
import { success } from "zod";

export class UserController {
  //get Profile
  getProfile = async (req: Request, res: Response) => {
    const profile = await userService.getProfile(req.user.id);

    return res.status(200).json({
      success: true,
      message: "profile Fetched Successfully",
      data: profile,
    });
  };

  //update profile

  updateProfile = async (req: Request, res: Response) => {
    const profile = await userService.updateProfile(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  };
}

export const userController = new UserController();
