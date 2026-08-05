import { eq } from "drizzle-orm";
import { DBClient } from "../../database/types.js";
import { users } from "../auth/auth.schema.js";
import { date } from "zod";

class UserRepository {
  async findProfileById(client: DBClient, userId: string) {
    const [user] = await client
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        dateOfBirth: users.dateOfBirth,
        gender: users.gender,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        avatarPublicId: users.avatarPublicId
      })
      .from(users)
      .where(eq(users.id, userId));
    return user;
  }

  async updateProfile(
    client: DBClient,
    userId: string,
    data: {
      fullName?: string;
      phone?: string;
      dateOfBirth?: string;
      gender?: string;
      bio?: string;
    },
  ) {
    const [updatedUser] = await client
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        dateOfBirth: users.dateOfBirth,
        gender: users.gender,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
      });
    return updatedUser;
  }

  async updateAvatar(
    client: DBClient,
    userId: string,
    avatarUrl: string,
    avatarPublicId: string,
  ) {
    const [user] = await client
      .update(users)
      .set({
        avatarUrl,
        avatarPublicId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        dateOfBirth: users.dateOfBirth,
        gender: users.gender,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
      });
    return user;
  }

  async findAvatarByUserId(client: DBClient, userId: string) {
    const [user] = await client
      .select({
        avatarUrl: users.avatarUrl,
        avatarPublicId: users.avatarPublicId,
      })
      .from(users)
      .where(eq(users.id, userId));
  }

   async deleteAvatar(client: DBClient, userId: string) {
    const [user] = await client
      .update(users)
      .set({
        avatarUrl: null,
        avatarPublicId: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        dateOfBirth: users.dateOfBirth,
        gender: users.gender,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
      });
      return user
  }

}

export const userRepository = new UserRepository();
