import { varchar } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: uuid().defaultRandom().primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),

    email: varchar("email", { length: 255 }).notNull().unique(),

    createdAt: timestamp("created_at").defaultNow().notNull()
})