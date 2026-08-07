import { eq, sql } from "drizzle-orm";
import { db } from "../../database/db.js";
import { BadRequestError } from "../../Errors/BadRequestError.js";
import { NotFoundError } from "../../Errors/NotFoundError.js";
import { activities } from "../activities/activity.schems.js";
import { BookingResponseDto, CreateBookingDto } from "./booking.dto.js";
import { bookingRepository } from "./booking.repository.js";
import { activitySlots } from "../activitySlots/activity-slot.schema.js";
class BookingService {
  async createBooking(
    userId: string,
    dto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    const booking = await db.transaction(async (tx) => {
      const slot = await bookingRepository.findSlotForUpdate(tx, dto.slotId);

      if (!slot) {
        throw new NotFoundError("Activity slot not found.");
      }

      if (slot.status === "CANCELLED") {
        throw new BadRequestError("This slot has been cancelled.");
      }

      if (slot.status === "FULL") {
        throw new BadRequestError("This slot is already full.");
      }

      if (slot.activityId !== dto.activityId) {
        throw new BadRequestError(
          "Slot does not belong to the specified activity.",
        );
      }

      const availableSeats = slot.capacity - slot.bookedCount;

      if (dto.numberOfTickets > availableSeats) {
        throw new BadRequestError(
          `Only ${availableSeats} seat(s) are available.`,
        );
      }

      const [activity] = await tx
        .select()
        .from(activities)
        .where(sql`${activities.id} = ${slot.activityId}`);

      if (!activity) {
        throw new NotFoundError("Activity not found.");
      }

      const pricePerTicket = slot.priceOverride ?? activity.price;

      if (!pricePerTicket) {
        throw new BadRequestError("Activity price is not configured.");
      }

      const totalAmount = Number(pricePerTicket) * dto.numberOfTickets;

      const bookingReference = `ADV-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()}`;

      const booking = await bookingRepository.create(tx, {
        bookingReference,

        userId,

        activityId: slot.activityId,

        slotId: slot.id,

        numberOfTickets: dto.numberOfTickets,

        pricePerTicket,

        totalAmount: totalAmount.toFixed(2),

        status: "PENDING",
      });

      const newBookedCount = slot.bookedCount + dto.numberOfTickets;

      const newStatus = newBookedCount >= slot.capacity ? "FULL" : "AVAILABLE";

      await tx
        .update(activitySlots)
        .set({
          bookedCount: newBookedCount,

          status: newStatus,

          updatedAt: new Date(),
        })
        .where(sql`${activitySlots.id} = ${slot.id}`);

      return booking;
    });

    return {
      id: booking.id,

      bookingReference: booking.bookingReference,

      userId: booking.userId,

      activityId: booking.activityId,

      slotId: booking.slotId,

      numberOfTickets: booking.numberOfTickets,

      pricePerTicket: booking.pricePerTicket,

      totalAmount: booking.totalAmount,

      status: booking.status,

      createdAt: booking.createdAt,
    };
  }
}

export const bookingService = new BookingService();
