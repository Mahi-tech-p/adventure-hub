import z from "zod";

export const userProfileSchema = z.object({
  fullName: z.string().trim().min(3).max(100).optional(),

  phone: z.string().trim().min(10).max(15).optional(),
  dataOfBirth: z.string().date().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),

  bio: z.string().max(500).optional(),
});
