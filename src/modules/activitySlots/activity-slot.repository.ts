import { and, eq } from "drizzle-orm";

import { DBClient } from "../../database/types.js";

import { activitySlots } from "./activity-slot.schema.js";
import { NewActivitySlot } from "./activity-slot.types.js";

class ActivitySlotRepository {

  // Create Slot
  async createSlot(
    client: DBClient,
    slot: NewActivitySlot
  ) {
    const [createdSlot] = await client
      .insert(activitySlots)
      .values(slot)
      .returning();

    return createdSlot;
  }

  // Find Slot By Id
  async findById(
    client: DBClient,
    slotId: string
  ) {
    const [slot] = await client
      .select()
      .from(activitySlots)
      .where(eq(activitySlots.id, slotId));

    return slot;
  }

  // Get Slots By Activity
  async findByActivity(
    client: DBClient,
    activityId: string
  ) {
    return await client
      .select()
      .from(activitySlots)
      .where(
        eq(activitySlots.activityId, activityId)
      );
  }

  // Check Duplicate Slot
  async findDuplicateSlot(
    client: DBClient,
    activityId: string,
    slotDate: string,
    startTime: string
  ) {
    const [slot] = await client
      .select()
      .from(activitySlots)
      .where(
        and(
          eq(activitySlots.activityId, activityId),
          eq(activitySlots.slotDate, slotDate),
          eq(activitySlots.startTime, startTime)
        )
      );

    return slot;
  }

  // Update Slot
  async updateSlot(
    client: DBClient,
    slotId: string,
    data: Partial<NewActivitySlot>
  ) {
    const [slot] = await client
      .update(activitySlots)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(activitySlots.id, slotId))
      .returning();

    return slot;
  }

  // Soft Delete Slot
  async deleteSlot(
    client: DBClient,
    slotId: string
  ) {
    const [slot] = await client
      .update(activitySlots)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
        status: "CANCELLED",
      })
      .where(eq(activitySlots.id, slotId))
      .returning();

    return slot;
  }
}

export const activitySlotRepository =
  new ActivitySlotRepository();