import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";

import {
  createBookingSchema,
} from "./booking.validation.js";

import {
  bookingController,
} from "./booking.controller.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate(createBookingSchema),
  asyncHandler(
    bookingController.createBooking
  )
);

router.get(
  "/",
  asyncHandler(
    bookingController.getMyBookings
  )
);

router.get(
  "/:id",
  asyncHandler(
    bookingController.getBooking
  )
);

router.patch(
  "/:id/cancel",
  asyncHandler(
    bookingController.cancelBooking
  )
);

export default router;