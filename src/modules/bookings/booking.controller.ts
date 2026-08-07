import { Request, Response } from "express";

import { CreateBookingDto } from "./booking.dto.js";
import { bookingService } from "./booking.service.js";

export class BookingController {
  createBooking = async (
    req: Request,
    res: Response
  ) => {
    const userId = req.user!.id;

    const dto = req.body as CreateBookingDto;

    const booking =
      await bookingService.createBooking(
        userId,
        dto
      );

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: booking,
    });
  };

  getBooking = async (
    req: Request,
    res: Response
  ) => {
    const userId = req.user!.id;

    const bookingId = req.params.id as string;

    const booking =
      await bookingService.getBooking(
        userId,
        bookingId
      );

    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully.",
      data: booking,
    });
  };

  getMyBookings = async (
    req: Request,
    res: Response
  ) => {
    const userId = req.user!.id;

    const bookings =
      await bookingService.getMyBookings(
        userId
      );

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully.",
      data: bookings,
    });
  };

  cancelBooking = async (
    req: Request,
    res: Response
  ) => {
    const userId = req.user!.id;

    const bookingId = req.params.id as string;

    const booking =
      await bookingService.cancelBooking(
        userId,
        bookingId
      );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: booking,
    });
  };
}

export const bookingController =
  new BookingController();