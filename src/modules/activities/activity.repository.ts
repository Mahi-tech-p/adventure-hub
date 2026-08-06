import { and, asc, count, desc, eq, ilike, SQL } from "drizzle-orm";
import { DBClient } from "../../database/types.js";
import { activities } from "./activity.schems.js";
import { NewActivity } from "./activity.types.js";
import { GetActivitiesQueryDto } from "./activity.dto.js";

class ActivityRepository {
  async createActivity(client: DBClient, activity: NewActivity) {
    const [createdActivity] = await client
      .insert(activities)
      .values(activity)
      .returning();
    return createdActivity;
  }

  async findById(client: DBClient, activityId: string) {
    const [activity] = await client
      .select({
        id: activities.id,
        name: activities.name,
        slug: activities.slug,
        price: activities.price,
        durationMinutes: activities.durationMinutes,
        difficulty: activities.difficulty,
        capacity: activities.capacity,
      })
      .from(activities)
      .where(eq(activities.id, activityId));
    return activity;
  }

  async findBySlug(client: DBClient, slug: string) {
    const [activity] = await client
      .select()
      .from(activities)
      .where(eq(activities.slug, slug));
    return activity;
  }

  async findByParkId(client: DBClient, parkId: string) {
    const [activity] = await client
      .select()
      .from(activities)
      .where(and(eq(activities.id, parkId), eq(activities.isActive, true)));
    return activity;
  }

  async updateActivity(
    client: DBClient,
    activityId: string,
    data: Partial<NewActivity>,
  ) {
    const [activity] = await client
      .update(activities)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(activities.id, activityId))
      .returning();

    return activity;
  }

  async deleteActivity(client: DBClient, activityId: string) {
    const [activity] = await client
      .update(activities)
      .set({
        isActive: false,
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(activities.id, activityId))
      .returning();

    return activity;
  }

  async findAll(client: DBClient, query: GetActivitiesQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const offset = (page - 1) * limit;
    const filters: SQL[] = [];

    if (query.search) {
      filters.push(ilike(activities.name, `%${query.search}%`));
    }
    if (query.parkId) {
      filters.push(eq(activities.parkId, query.parkId));
    }

    if (query.difficulty) {
      filters.push(eq(activities.difficulty, query.difficulty));
    }

    if (query.status) {
      filters.push(eq(activities.status, query.status));
    }

    if (query.isActive !== undefined) {
      filters.push(eq(activities.isActive, query.isActive));
    }
    const sortMap = {
      name: activities.name,
      price: activities.price,
      createdAt: activities.createdAt,
    };

    const sortColumn =
      sortMap[query.sortBy as keyof typeof sortMap] ?? activities.createdAt;

    const sortOrder =
      query.order === "asc" ? asc(sortColumn) : desc(sortColumn);

    const [{ total }] = await client
      .select({
        total: count(),
      })
      .from(activities)
      .where(filters.length ? and(...filters) : undefined);

    const data = await client
      .select({
        id: activities.id,
        parkId: activities.parkId,
        name: activities.name,
        slug: activities.slug,
        price: activities.price,
        durationMinutes: activities.durationMinutes,
        difficulty: activities.difficulty,
        status: activities.status,
        isActive: activities.isActive,
      })
      .from(activities)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(sortOrder)
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const activityRepository = new ActivityRepository();
