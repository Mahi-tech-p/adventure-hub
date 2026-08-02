import { eq } from "drizzle-orm";

import { db } from "../../database/db.js";
import { refreshTokens, users } from "./auth.schema.js";
import {
  NewRefreshToken,
  NewUser,
} from "./auth.types.js";
import { DBClient } from "../../database/types.js";


export class AuthRepository {
  // ===========================
  // Users
  // ===========================

  async createUser(client: DBClient, user: NewUser) {
    const [createdUser] = await client
      .insert(users)
      .values(user)
      .returning();

    return createdUser;
  }

  async findUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user;
  }

  async findUserById(userId: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    return user;
  }

  async updateLastLogin(client: DBClient, userId: string) {
    await client
      .update(users)
      .set({
        lastLoginedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // ===========================
  // Refresh Tokens
  // ===========================

  async createRefreshToken(
    client: DBClient,
    token: NewRefreshToken
  ) {
    const [createdToken] = await client
      .insert(refreshTokens)
      .values(token)
      .returning();

    return createdToken;
  }

  async findRefreshToken(hashedToken: string) {
    const [token] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.hashedToken, hashedToken));

    return token;
  }

  async revokeRefreshToken(client: DBClient, id: string) {
    await client
      .update(refreshTokens)
      .set({
        isRevoked: true,
        revokedAt: new Date(),
      })
      .where(eq(refreshTokens.id, id));
  }

  async deleteRefreshToken(client: DBClient, id: string) {
    await client
      .delete(refreshTokens)
      .where(eq(refreshTokens.id, id));
  }

  async revokeAllRefreshTokens(
    client: DBClient,
    userId: string
  ) {
    await client
      .update(refreshTokens)
      .set({
        isRevoked: true,
        revokedAt: new Date(),
      })
      .where(eq(refreshTokens.userId, userId));
  }
}

export const authRepository = new AuthRepository();