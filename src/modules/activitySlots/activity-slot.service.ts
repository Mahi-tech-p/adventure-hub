import { db } from "../../database/db.js";

import { BadRequestError } from "../../Errors/BadRequestError.js";
import { NotFoundError } from "../../Errors/NotFoundError.js";

import {
  ActivitySlotResponseDto,
  CreateActivitySlotDto,
} from "./activity-slot.dto.js";

import { activityRepository } from "../activities/activity.repository.js";
import { activitySlotRepository } from "./activity-slot.repository.js";
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
export class ActivitySlotService {
  async createSlot(
    dto: CreateActivitySlotDto,
  ): Promise<ActivitySlotResponseDto> {

    const activity = await activityRepository.findById(db, dto.activityId);

    if (!activity) {
      throw new NotFoundError("Activity not found.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const slotDate = new Date(dto.slotDate);

    if (slotDate < today) {
      throw new BadRequestError("Slot date cannot be in the past.");
    }

    if (timeToMinutes(dto.startTime) >= timeToMinutes(dto.endTime)) {
      throw new BadRequestError("End time must be after start time.");
    }

    const existingSlot = await activitySlotRepository.findDuplicateSlot(
      db,
      dto.activityId,
      dto.slotDate,
      dto.startTime,
    );

    if (existingSlot) {
      throw new BadRequestError(
        "A slot already exists for this activity at the specified date and time.",
      );
    }

    const slot = await db.transaction(async (tx) => {
      return await activitySlotRepository.createSlot(tx, {
        ...dto,
      });
    });

    return {
      id: slot.id,
      activityId: slot.activityId,

      slotDate: slot.slotDate,

      startTime: slot.startTime,

      endTime: slot.endTime,

      capacity: slot.capacity,

      bookedCount: slot.bookedCount,

      availableCount: slot.capacity - slot.bookedCount,

      priceOverride: slot.priceOverride,

      status: slot.status,

      createdAt: slot.createdAt,
    };
  }
}

export const activitySlotService = new ActivitySlotService();
