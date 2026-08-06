import { db } from "../../database/db.js";

import { NotFoundError } from "../../Errors/NotFoundError.js";
import { BadRequestError } from "../../Errors/BadRequestError.js";

import { ActivityResponseDto, CreateActivityDto } from "./activity.dto.js";

import { activityRepository } from "./activity.repository.js";
import { parkRepository } from "../parks/park.repository.js";
import {
  generateSlug,
  generateSlugWithSuffix,
} from "../../shared/utils/slugs.js";

export class ActivityService {

  async createActivity(dto: CreateActivityDto): Promise<ActivityResponseDto> {
    const park = await parkRepository.findbyId(db, dto.parkId);

    if (!park) {
      throw new NotFoundError("Park not found.");
    }


    if (dto.minimumAge && dto.maximumAge && dto.minimumAge > dto.maximumAge) {
      throw new BadRequestError(
        "Minimum age cannot be greater than maximum age.",
      );
    }

    if (
      dto.minimumHeight &&
      dto.maximumHeight &&
      dto.minimumHeight > dto.maximumHeight
    ) {
      throw new BadRequestError(
        "Minimum height cannot be greater than maximum height.",
      );
    }

    if (
      dto.minimumWeight &&
      dto.maximumWeight &&
      dto.minimumWeight > dto.maximumWeight
    ) {
      throw new BadRequestError(
        "Minimum weight cannot be greater than maximum weight.",
      );
    }

    let slug = generateSlug(dto.name);

    const existingActivity = await activityRepository.findBySlug(db, slug);

    if (existingActivity) {
      slug = generateSlugWithSuffix(slug);
    }

    const activity = await db.transaction(async (tx) => {
      return await activityRepository.createActivity(tx, {
        ...dto,
        slug,
      });
    });

    return {
      id: activity.id,
      parkId: activity.parkId,

      name: activity.name,
      slug: activity.slug,

      description: activity.description,
      shortDescription: activity.shortDescription,

      price: activity.price,
      currency: activity.currency,

      durationMinutes: activity.durationMinutes,

      minimumAge: activity.minimumAge,
      maximumAge: activity.maximumAge,

      minimumHeight: activity.minimumHeight,
      maximumHeight: activity.maximumHeight,

      minimumWeight: activity.minimumWeight,
      maximumWeight: activity.maximumWeight,

      capacity: activity.capacity,

      difficulty: activity.difficulty,

      status: activity.status,

      isActive: activity.isActive,

      createdAt: activity.createdAt,
    };
  }
}

export const activityService = new ActivityService();
