import { and, eq } from "drizzle-orm";
import { DBClient } from "../../database/types.js";
import { activities } from "./activity.schems.js";
import { NewActivity } from "./activity.types.js";

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
}

export const activityRepository = new ActivityRepository();
