import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  numeric,
  time,
  doublePrecision,
} from "drizzle-orm/pg-core";

import { users } from "../auth/auth.schema.js";

export const parks = pgTable("parks", {
  // Identity
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  slug: varchar("slug", {
    length: 255,
  })
    .notNull()
    .unique(),

  // Information
  description: text("description"),

  shortDescription: varchar(
    "short_description",
    {
      length: 500,
    }
  ),

  // Contact
  phone: varchar("phone", {
    length: 20,
  }),

  email: varchar("email", {
    length: 255,
  }),

  website: varchar("website", {
    length: 255,
  }),

  // Address
  address: text("address").notNull(),

  city: varchar("city", {
    length: 100,
  }).notNull(),

  state: varchar("state", {
    length: 100,
  }).notNull(),

  country: varchar("country", {
    length: 100,
  }).notNull(),

  zipCode: varchar("zip_code", {
    length: 20,
  }),

  latitude: doublePrecision("latitude"),

  longitude: doublePrecision("longitude"),
  // Business
  openingTime: time("opening_time"),

  closingTime: time("closing_time"),

  // Status
  isActive: boolean("is_active")
    .default(true)
    .notNull(),

  isVerified: boolean("is_verified")
    .default(false)
    .notNull(),

  // Audit
  createdBy: uuid("created_by")
    .references(() => users.id)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),

  deletedAt: timestamp("deleted_at"),
});