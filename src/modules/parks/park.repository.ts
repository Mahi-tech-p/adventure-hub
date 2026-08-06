import { and, asc, count, desc, eq, ilike, SQL } from "drizzle-orm";
import { DBClient } from "../../database/types.js";
import { parks } from "./park.schema.js";
import { NewPark } from "./park.types.js";
import { GetParkQueryDto } from "./park.dto.js";

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

  async updatePark(client: DBClient, parkId: string, data: Partial<NewPark>) {
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

  async findAll(client: DBClient, query: GetParkQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const offset = (page - 1) * limit;

    const filters: SQL[] = [];

    if (query.search) {
      filters.push(ilike(parks.name, `${query.search}`));
    }
    if (query.city) {
      filters.push(eq(parks.city, query.city));
    }

    if (query.state) {
      filters.push(eq(parks.state, query.state));
    }

    if (query.country) {
      filters.push(eq(parks.country, query.country));
    }

    if (query.isActive !== undefined) {
      filters.push(eq(parks.isActive, query.isActive));
    }

    const sortMap = {
      name: parks.name,
      city: parks.city,
      createdAt: parks.createdAt,
    };

    const sortColumn =
      sortMap[query.sortBy as keyof typeof sortMap] ?? parks.createdAt;

    const order = query.order === "asc" ? asc(sortColumn) : desc(sortColumn);

    const [{ total }] = await client
      .select({
        total: count(),
      })
      .from(parks)
      .where(filters.length ? and(...filters) : undefined);

    const data = await client
      .select({
        id: parks.id,
        name: parks.name,
        slug: parks.slug,
        shortDescription: parks.shortDescription,
        city: parks.city,
        state: parks.state,
        country: parks.country,
        isActive: parks.isActive,
      })
      .from(parks)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(order)
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

export const parkRepository = new ParkRepository();
