import { eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { refreshTokens, users } from "./auth.schema.js";
import { NewRefreshToken, NewUser, RefreshToken } from "./auth.types.js";



class AuthRepository {
    //create user in DB
    async createUser(user: NewUser) {
        const [createdUser] = await db.insert(users).values(user).returning();
        return createdUser;
    }

    //findUserByEmail
    async findUserByEmail(email: string) {
        const [user] = await db.select().from(users).where(eq(users.email, email))
        return user
    }

    //findUserById
    async findUserById(userId: string) {
        const [user] = await db.select().from(users).where(eq(users.id, userId))
        return user;
    }

    //UpdateLastLogin
    async updateLastLogin(userId: string) {
        await db
            .update(users)
            .set({
                lastLoginedAt: new Date()
            })
            .where(eq(users.id, userId))
    }

    //createRefresh Token
    async createRefreshToken(token: NewRefreshToken) {
        const [createdToken] = await db
            .insert(refreshTokens)
            .values(token)
            .returning()
        return createdToken
    }

    //Find Refresh Token
    async findRefreshToken(hashedToken: string) {
        const [token] = await db
            .select()
            .from(refreshTokens)
            .where(eq(refreshTokens.hashedToken, hashedToken))
        return token
    }

    //Rewoke Refresh Token
    async revokeRefreshToken(id: string) {
        await db
            .update(refreshTokens)
            .set({
                isRevoked: true,
                revokedAt: new Date(),
            })
            .where(eq(refreshTokens.id, id));
    }

    //delete refresh token

    async deleteRefreshToken(id: string) {
        await db
            .delete(refreshTokens)
            .where(eq(refreshTokens.id, id));
    }

}

export const authRepository = new AuthRepository();
