import { date, text, varchar } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { inet } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: uuid("id")
        .defaultRandom()
        .primaryKey(),

    fullName: varchar("full_name", { length: 255 })
        .notNull(),

    email: varchar("email", { length: 255 }).unique().notNull(),
    phone : varchar("phone",{length:15}),
    dateOfBirth : date("date_of_birth"),
    gender: varchar("gender",{length:20}),
    avatarUrl : text("avatar_url"),
    bio:text('bio'),
    avatarPublicId: text("avatar_public_id"),
    passwordHash: varchar("password_hash", { length: 255 })
        .notNull(),
    isEmailVerified: boolean("is_email_verified")
        .default(false)
        .notNull(),
    isActive: boolean("is_active")
        .default(true)
        .notNull(),
    lastLoginedAt: timestamp("last_logined_at"),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export const refreshTokens = pgTable("refresh_tokens", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    hashedToken: varchar("hashed_token", {
        length: 255,
    }).notNull(),

    deviceName: varchar("device_name", {
        length: 255,
    }),

    userAgent: varchar("user_agent", {
        length: 512,
    }),

    ipAddress: inet("ip_address"),

    expiresAt: timestamp("expires_at", {
        withTimezone: true,
    }).notNull(),

    isRevoked: boolean("is_revoked")
        .default(false)
        .notNull(),

    revokedAt: timestamp("revoked_at", {
        withTimezone: true,
    }),

    lastUsedAt: timestamp("last_used_at", {
        withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),

})