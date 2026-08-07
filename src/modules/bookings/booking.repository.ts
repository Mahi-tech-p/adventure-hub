import { and, eq, sql } from "drizzle-orm";
import { DBClient } from "../../database/types.js";
import { bookings } from "./booking.schema.js";
import { NewBooking } from "./booking.types.js";
import { activitySlots } from "../activitySlots/activity-slot.schema.js";

class BookingRepository {
  async create(client: DBClient, data: NewBooking) {
    const [booking] = await client.insert(bookings).values(data).returning();

    return booking;
  }

  async findById(client: DBClient, bookingId: string) {
    const [booking] = await client
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));
    return booking;
  }

  async findByIdAndUser(client: DBClient, bookingId: string, userId: string) {
    const [booking] = await client
      .select()
      .from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.userId, userId)));
    return booking;
  }

  async findByUser(client: DBClient, userdId: string) {
    const [booking] = await client
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userdId));
    return booking;
  }

  async updateBooking(
    client: DBClient,
    bookingID: string,
    data: Partial<NewBooking>,
  ) {
    const [booking] = await client
      .update(bookings)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingID))
      .returning();

    return booking;
  }

  async findSlotForUpdate(client: DBClient, slotId: string) {
    const [slot] = await client
      .select()
      .from(activitySlots)
      .where(eq(activitySlots.id, slotId))
      .for("update");
    return slot;
  }
  async incrementBookedCount(
    client: DBClient,
    slotId: string,
    numberOfTickets: number,
  ) {
    const [slot] = await client
      .update(activitySlots)
      .set({
        bookedCount: sql`${activitySlots.bookedCount} + ${numberOfTickets}`,
        updatedAt: new Date(),
      })
      .where(eq(activitySlots.id, slotId))
      .returning();

    return slot;
  }
}

export const bookingRepository = new BookingRepository();
