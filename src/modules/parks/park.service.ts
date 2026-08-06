import { db } from "../../database/db.js";
import {
  generateSlug,
  generateSlugWithSuffix,
} from "../../shared/utils/slugs.js";
import { parkRepository } from "./park.repository.js";
import { CreateParkDto, GetParkQueryDto, UpdateParkDto } from "./park.dto.js";
import { NotFoundError } from "../../Errors/NotFoundError.js";

export class ParkService {
  async createPark(dto: CreateParkDto, createdBy: string) {
    let slug = generateSlug(dto.name);

    const exisitingPark = await parkRepository.findBySlug(db, slug);

    if (exisitingPark) {
      slug = generateSlugWithSuffix(slug);
    }

    const park = await db.transaction(async (tx) => {
      return await parkRepository.createPark(tx, {
        ...dto,
        slug,
        createdBy,
      });
    });
    return {
      id: park.id,
      name: park.name,
      slug: park.slug,
      city: park.city,
      state: park.state,
      country: park.country,
      isActive: park.isActive,
    };
  }

  async updatePark(parkId: string, dto: UpdateParkDto) {
    const existingPark = await parkRepository.findbyId(db, parkId);

    if (!existingPark) {
      throw new NotFoundError("Park not found.");
    }

    let slug = existingPark.slug;

    if (dto.name && dto.name !== existingPark.name) {
      slug = generateSlug(dto.name);

      const slugExists = await parkRepository.findBySlug(db, slug);

      if (slugExists) {
        slug = generateSlugWithSuffix(slug);
      }
    }

    return db.transaction(async (tx) => {
      return await parkRepository.updatePark(tx, parkId, {
        ...dto,
        slug,
      });
    });
  }

  async getPark(query: GetParkQueryDto){
    return await parkRepository.findAll(db, query)
  }
}

export const parkService = new ParkService();
