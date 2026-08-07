import {
  pgEnum,
  pgTable,
  uuid,
  numeric,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { bookings } from "../bookings/booking.schema.js";

export const paymentStatusEnum = pgEnum(
  "payment_status",
  [
    "PENDING",
    "SUCCESS",
    "FAILED",
    "REFUNDED",
  ]
);

export const paymentMethodEnum = pgEnum(
  "payment_method",
  [
    "RAZORPAY",
    "STRIPE",
  ]
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id")
      .primaryKey()
      .defaultRandom(),

    bookingId: uuid("booking_id")
      .references(() => bookings.id)
      .notNull()
      .unique(),

    paymentReference: varchar(
      "payment_reference",
      {
        length: 100,
      }
    )
      .notNull()
      .unique(),

    gatewayPaymentId: varchar(
      "gateway_payment_id",
      {
        length: 150,
      }
    ),

    gatewayOrderId: varchar(
      "gateway_order_id",
      {
        length: 150,
      }
    ),

    amount: numeric(
      "amount",
      {
        precision: 10,
        scale: 2,
      }
    ).notNull(),

    currency: varchar(
      "currency",
      {
        length: 3,
      }
    )
      .notNull()
      .default("INR"),

    method: paymentMethodEnum(
      "method"
    ).notNull(),

    status: paymentStatusEnum(
      "status"
    )
      .notNull()
      .default("PENDING"),

    failureReason: varchar(
      "failure_reason",
      {
        length: 500,
      }
    ),

    paidAt: timestamp("paid_at"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },

  (table) => ({
    bookingIdIdx: index(
      "payments_booking_id_idx"
    ).on(table.bookingId),

    gatewayPaymentIdIdx: index(
      "payments_gateway_payment_id_idx"
    ).on(table.gatewayPaymentId),

    statusIdx: index(
      "payments_status_idx"
    ).on(table.status),
  })
);