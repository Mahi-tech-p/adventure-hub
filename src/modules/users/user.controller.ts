import { Request, Response } from "express";
import { userService } from "./user.service.js";
import { success } from "zod";
import { BadRequestError } from "../../Errors/BadRequestError.js";

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

  updateAvatar = async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError("Avatar is Required");
    }

    const user = await userService.uploadAvatar(req.user.id, req.file);

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: user,
    });
  };

  deleteAvatar = async (req: Request, res: Response) => {
    const profile = await userService.deleteAvatar(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Avatar deleted successfully.",
      data: profile,
    });
  };

  changePassword = async (
  req: Request,
  res: Response
) => {

  await userService.changePassword(
    req.user.id,
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Password changed successfully. Please login again.",
  });
};
}

export const userController = new UserController();
