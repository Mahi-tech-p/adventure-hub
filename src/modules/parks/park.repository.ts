import { eq } from "drizzle-orm";
import { DBClient } from "../../database/types.js";
import { parks } from "./park.schema.js";
import { NewPark } from "./park.types.js";

class ParkRepository {
  async createPark(client: DBClient, park: NewPark) {
    const [createdPark] = await client.insert(parks).values(park).returning();
    return createdPark;
  }

  //FindBySlug

  async findBySlug(client: DBClient, slug: string) {
    const [park] = await client
      .select()
      .from(parks)
      .where(eq(parks.slug, slug));
    return park;
  }

  //findByID

  async findbyId(clent: DBClient, id: string) {
    const [park] = await clent.select().from(parks).where(eq(parks.id, id));
  }

  async updatePark(
  client: DBClient,
  parkId: string,
  data: Partial<NewPark>
) {
  const [park] = await client
    .update(parks)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(parks.id, parkId))
    .returning();

  return park;
}
}

export const parkRepository = new ParkRepository()
