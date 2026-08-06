import { z } from "zod";

export const createActivitySchema = z.object({

  parkId: z.uuid(),

  name: z.string().trim().min(3).max(255),

  description: z.string().optional(),

  shortDescription: z
    .string()
    .max(500)
    .optional(),

  price: z.string(),

  currency: z.string().default("INR"),

  durationMinutes: z
    .number()
    .positive(),

  minimumAge: z.number().optional(),

  maximumAge: z.number().optional(),

  minimumHeight: z.number().optional(),

  maximumHeight: z.number().optional(),

  minimumWeight: z.number().optional(),

  maximumWeight: z.number().optional(),

  capacity: z
    .number()
    .positive(),

  difficulty: z.enum([
    "EASY",
    "MEDIUM",
    "HARD",
  ]),
});

export const updateActivitySchema =
  createActivitySchema.partial();