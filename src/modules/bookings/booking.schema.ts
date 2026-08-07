import {
  pgEnum,
  pgTable,
  uuid,
  integer,
  numeric,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../auth/auth.schema.js";
import { activities } from "../activities/activity.schems.js";
import { activitySlots } from "../activitySlots/activity-slot.schema.js";



export const bookingStatusEnum = pgEnum(
  "booking_status",
  [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
  ]
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    bookingReference: varchar(
      "booking_reference",
      {
        length: 30,
      }
    )
      .notNull()
      .unique(),

    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),

    activityId: uuid("activity_id")
      .references(() => activities.id)
      .notNull(),

    slotId: uuid("slot_id")
      .references(() => activitySlots.id)
      .notNull(),

    numberOfTickets: integer(
      "number_of_tickets"
    ).notNull(),

    pricePerTicket: numeric(
      "price_per_ticket",
      {
        precision: 10,
        scale: 2,
      }
    ).notNull(),

    totalAmount: numeric(
      "total_amount",
      {
        precision: 10,
        scale: 2,
      }
    ).notNull(),

    status: bookingStatusEnum(
      "status"
    )
      .default("PENDING")
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },

  (table) => ({
    userIdIdx: index(
      "bookings_user_id_idx"
    ).on(table.userId),

    slotIdIdx: index(
      "bookings_slot_id_idx"
    ).on(table.slotId),

    activityIdIdx: index(
      "bookings_activity_id_idx"
    ).on(table.activityId),

    statusIdx: index(
      "bookings_status_idx"
    ).on(table.status),
  })
);