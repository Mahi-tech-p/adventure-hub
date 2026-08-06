import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

import { parks } from "../parks/park.schema.js";

export const difficultyEnum = pgEnum("activity_difficulty", [
  "EASY",
  "MEDIUM",
  "HARD",
]);

export const activityStatusEnum = pgEnum("activity_status", [
  "ACTIVE",
  "MAINTENANCE",
  "CLOSED",
]);

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),

  parkId: uuid("park_id")
    .references(() => parks.id)
    .notNull(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  slug: varchar("slug", {
    length: 255,
  })
    .notNull()
    .unique(),

  description: text("description"),

  shortDescription: varchar("short_description", {
    length: 500,
  }),

  price: numeric("price", {
    precision: 10,
    scale: 2,
  }).notNull(),

  currency: varchar("currency", {
    length: 3,
  })
    .default("INR")
    .notNull(),

  durationMinutes: integer("duration_minutes").notNull(),

  minimumAge: integer("minimum_age"),

  maximumAge: integer("maximum_age"),

  minimumHeight: integer("minimum_height"),

  maximumHeight: integer("maximum_height"),

  minimumWeight: integer("minimum_weight"),

  maximumWeight: integer("maximum_weight"),

  capacity: integer("capacity").notNull(),

  difficulty: difficultyEnum("difficulty").notNull(),

  status: activityStatusEnum("status").default("ACTIVE").notNull(),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  deletedAt: timestamp("deleted_at"),
});
