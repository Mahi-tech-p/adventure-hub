import { z } from "zod";

export const createActivitySlotSchema =
  z.object({

    activityId: z.uuid(),

    slotDate: z.string(),

    startTime: z.string(),

    endTime: z.string(),

    capacity: z
      .number()
      .positive(),

    priceOverride:
      z.string().optional(),
  });

export const updateActivitySlotSchema =
  createActivitySlotSchema.partial();