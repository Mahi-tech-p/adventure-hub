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
export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});