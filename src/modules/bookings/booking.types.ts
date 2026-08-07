import {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import { bookings } from "./booking.schema.js";

export type Booking = InferSelectModel<
  typeof bookings
>;

export type NewBooking = InferInsertModel<
  typeof bookings
>;