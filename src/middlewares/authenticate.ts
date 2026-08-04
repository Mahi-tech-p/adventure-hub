import { NextFunction, Request, Response } from "express";

import { UnauthorizedError } from "../Errors/UnauthorizedError.js";
import { verifyAccessToken } from "../shared/security/jwt.js";
import { authRepository } from "../modules/auth/auth.repository.js";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("Access token is required.");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid authorization header.");
    }

    const accessToken = authHeader.split(" ")[1];

    const payload = verifyAccessToken(accessToken);

    const user = await authRepository.findUserById(payload.userId);

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("User account is inactive.");
    }

    req.user ={
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive
    };

    next();
  } catch (error) {
    next(error);
  }
};