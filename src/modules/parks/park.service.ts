import { db } from "../../database/db.js";
import {
  generateSlug,
  generateSlugWithSuffix,
} from "../../shared/utils/slugs.js";
import { parkRepository } from "./park.controller.js";
import { CreateParkDto } from "./park.dto.js";

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
    return park;
  }
}

export const parkService = new ParkService();
