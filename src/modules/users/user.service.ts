import { db } from "../../database/db.js";
import { NotFoundError } from "../../Errors/NotFoundError.js";
import { storageService } from "../../shared/storage/cloudinary.service.js";
import { AuthService } from "../auth/auth.service.js";
import { updateProfileDto, UserProfileDto } from "./user.dto.js";
import { userRepository } from "./user.repository.js";

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
      if (exisitingUser.avatarPublicId) {
        try {
          await storageService.delete(exisitingUser.avatarPublicId);
        } catch (err) {
          console.error("Failed to delete old avatar:", err);
        }
      }

      return updatedUser!;
    });
  }
}

export const userService = new UserService();
