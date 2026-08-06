import {
  pgTable,
  uuid,
  integer,
  date,
  time,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { activities } from "../activities/activity.schems.js";


export const slotStatusEnum = pgEnum(
  "slot_status",
  [
    "AVAILABLE",
    "FULL",
    "CANCELLED",
  ]
);

export const activitySlots = pgTable(
  "activity_slots",
  {

    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    activityId: uuid("activity_id")
      .references(() => activities.id)
      .notNull(),

    slotDate: date("slot_date")
      .notNull(),

    startTime: time("start_time")
      .notNull(),

    endTime: time("end_time")
      .notNull(),

    capacity: integer("capacity")
      .notNull(),

    bookedCount: integer("booked_count")
      .default(0)
      .notNull(),

    priceOverride: numeric(
      "price_override",
      {
        precision: 10,
        scale: 2,
      }
    ),

    status: slotStatusEnum("status")
      .default("AVAILABLE")
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),

    deletedAt: timestamp("deleted_at"),
  }
);