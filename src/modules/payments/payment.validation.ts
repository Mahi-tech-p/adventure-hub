import { z } from "zod";

export const createPaymentSchema = z.object({
  bookingId: z
    .string()
    .uuid(),

  method: z.enum([
    "RAZORPAY",
    "STRIPE",
  ]),
});