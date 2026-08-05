import { z } from "zod";

export const createParkSchema = z.object({
  name: z.string().trim().min(3).max(255),

  description: z.string().trim().optional(),

  shortDescription: z
    .string()
    .trim()
    .max(500)
    .optional(),

  phone: z.string().trim().optional(),

  email: z.email().optional(),

  website: z.url().optional(),

  address: z.string().trim().min(5),

  city: z.string().trim().min(2),

  state: z.string().trim().min(2),

  country: z.string().trim().min(2),

  zipCode: z.string().trim().optional(),

  latitude: z.number().optional(),

  longitude: z.number().optional(),

  openingTime: z.string().optional(),

  closingTime: z.string().optional(),
});