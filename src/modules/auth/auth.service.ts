import { db } from "../../database/db.js";

import { ConflictError } from "../../Errors/ConflictError.js";

import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  hashToken,
  JwtPayload,
} from "../../shared/security/index.js";

import {
  AuthResponseDto,
  RegisterDto,
} from "./auth.dto.js";

import { authRepository } from "./auth.repository.js";

export class AuthService {
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
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
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
}

export const authService = new AuthService();