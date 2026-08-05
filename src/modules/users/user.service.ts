import { eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { DBClient } from "../../database/types.js";
import { NotFoundError } from "../../Errors/NotFoundError.js";
import { storageService } from "../../shared/storage/cloudinary.service.js";
import { users } from "../auth/auth.schema.js";
import { authService, AuthService } from "../auth/auth.service.js";
import { ChangePasswordDto, updateProfileDto, UserProfileDto } from "./user.dto.js";
import { userRepository } from "./user.repository.js";
import { comparePassword, hashPassword } from "../../shared/security/bcrypt.js";
import { BadRequestError } from "../../Errors/BadRequestError.js";
import { UnauthorizedError } from "../../Errors/UnauthorizedError.js";
import { authRepository } from "../auth/auth.repository.js";

export class UserService {
  // get Profile
  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await userRepository.findProfileById(db, userId);

    if (!user) {
      throw new NotFoundError("User not Found");
    }
    return user;
  }

  //Update Profile

  async updateProfile(
    userId: string,
    dto: updateProfileDto,
  ): Promise<UserProfileDto> {
    {
      const user = await db.transaction(async (tx) => {
        const exisitingUser = await userRepository.findProfileById(tx, userId);

        if (!exisitingUser) {
          throw new NotFoundError("User not found..");
        }

        return await userRepository.updateProfile(tx, userId, dto);
      });
      return user!;
    }
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UserProfileDto> {
    return db.transaction(async (tx) => {
      const exisitingUser = await userRepository.findProfileById(tx, userId);
      if (!exisitingUser) {
        throw new NotFoundError("User notFound....");
      }
      if (exisitingUser.avatarPublicId) {
        await storageService.delete(exisitingUser.avatarPublicId);
      }
      const uploaded = await storageService.upload({
        file,
        fileName: userId,
        folder: "avatars",
      });

      const updatedUser = await userRepository.updateAvatar(
        tx,
        userId,
        uploaded.url,
        uploaded.publicId,
      );
      return updatedUser!;
    });
  }

  async deleteAvatar(userId: string): Promise<UserProfileDto> {
    const existingUser = await userRepository.findProfileById(db, userId);

    if (!existingUser) {
      throw new NotFoundError("User Not Found");
    }

    if (!existingUser.avatarPublicId) {
      const profile = await userRepository.findProfileById(db, userId);
      return profile!;
    }

    await storageService.delete(existingUser.avatarPublicId);

    const updateUser = await db.transaction(async (tx) => {
      return await userRepository.deleteAvatar(tx, userId);
    });
    return updateUser!;

  }

  async changePassword(
  userId: string,
  dto: ChangePasswordDto
): Promise<void> {

  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  const isCurrentPasswordValid =
    await comparePassword(
      dto.currentPassword,
      user.passwordHash
    );

  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError(
      "Current password is incorrect."
    );
  }

  const isSamePassword =
    await comparePassword(
      dto.newPassword,
      user.passwordHash
    );

  if (isSamePassword) {
    throw new BadRequestError(
      "New password must be different from the current password."
    );
  }

  const passwordHash =
    await hashPassword(dto.newPassword);

  await db.transaction(async (tx) => {

    await userRepository.updatePassword(
      tx,
      userId,
      passwordHash
    );

    await authService.revokeAllSessions(
      tx,
      userId
    );
  });
}
}

export const userService = new UserService();
