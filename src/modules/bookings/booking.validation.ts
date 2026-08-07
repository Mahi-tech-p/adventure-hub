import { z } from "zod";

export const createBookingSchema = z.object({
  activityId: z.uuid(),

  slotId: z.uuid(),

  numberOfTickets: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(20),
});