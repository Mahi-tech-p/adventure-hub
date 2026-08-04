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
      })
      .from(users)
      .where(eq(users.id, userId));
      return user
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
}

export const userRepository =  new UserRepository();
