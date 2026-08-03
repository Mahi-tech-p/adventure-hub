import { db } from "../../database/db.js";

import { ConflictError } from "../../Errors/ConflictError.js";
import { ForbiddenError } from "../../Errors/ForbiddenError.js";
import { UnauthorizedError } from "../../Errors/UnauthorizedError.js";

import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  hashToken,
  JwtPayload,
  verifyRefreshToken,
} from "../../shared/security/index.js";

import { AuthResponseDto, LoginDto, RegisterDto } from "./auth.dto.js";

import { authRepository } from "./auth.repository.js";

export class AuthService {
  //Register Endpoint Service
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await authRepository.findUserByEmail(dto.email);

    if (existingUser) {
      throw new ConflictError("Email already exists.");
    }

    const passwordHash = await hashPassword(dto.password);

    return db.transaction(async (tx) => {
      const user = await authRepository.createUser(tx, {
        fullName: dto.fullName,
        email: dto.email,
        passwordHash,
      });

      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await authRepository.createRefreshToken(tx, {
        userId: user.id,
        hashedToken: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        accessToken,
        refreshToken,
      };
    });
  }

  // Login Endpoint service

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    //Find user

    const user = await authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Your account has been deactivated");
    }

    const isPasswordValid = await comparePassword(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid Username or Password");
    }

    return db.transaction(async (tx) => {
      await authRepository.updateLastLogin(tx, user.id);

      //JWT Payload

      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
      };

      //Generate Tokens

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      //save refreshedHashedToken

      await authRepository.createRefreshToken(tx, {
        userId: user.id,
        hashedToken: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        accessToken,
        refreshToken,
      };
    });
  }

  //RefreshToken

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    let payload: JwtPayload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    const hashedToken = hashToken(refreshToken);

    const storedToken = await authRepository.findRefreshToken(hashedToken);
    if (payload.userId !== storedToken.userId) {
      throw new UnauthorizedError("Invalid refresh token.");
    }
    if (!storedToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    if (storedToken.isRevoked) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    const user = await authRepository.findUserById(storedToken.userId);

    if (!user) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    return db.transaction(async (tx) => {
      await authRepository.revokeRefreshToken(tx, storedToken.id);

      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
      };

      const accessToken = generateAccessToken(payload);

      const newRefreshToken = generateRefreshToken(payload);

      await authRepository.createRefreshToken(tx, {
        userId: user.id,
        hashedToken: hashToken(newRefreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        accessToken,
        refreshToken: newRefreshToken,
      };
    });
  }
}

export const authService = new AuthService();
