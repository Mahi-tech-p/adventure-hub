import { eq } from "drizzle-orm";

import { db } from "../../database/db.js";

import { BadRequestError } from "../../Errors/BadRequestError.js";
import { NotFoundError } from "../../Errors/NotFoundError.js";

import { bookings } from "../bookings/booking.schema.js";


import {
  CreatePaymentDto,
} from "./payment.dto.js";

import {
  PaymentResponseDto,
} from "./payment.types.js";
import { paymentGateway } from "./razorpay.getway.js";
import { paymentRepository } from "./payment.respository.js";

class PaymentService {
  async createPayment(
    userId: string,
    dto: CreatePaymentDto
  ): Promise<PaymentResponseDto> {

    const result = await db.transaction(
      async (tx) => {

        // -----------------------------------------
        // 1. Find booking
        // -----------------------------------------

        const [booking] = await tx
          .select()
          .from(bookings)
          .where(
            eq(
              bookings.id,
              dto.bookingId
            )
          );

        if (!booking) {
          throw new NotFoundError(
            "Booking not found."
          );
        }

        // -----------------------------------------
        // 2. Verify ownership
        // -----------------------------------------

        if (booking.userId !== userId) {
          throw new BadRequestError(
            "You are not allowed to pay for this booking."
          );
        }

        // -----------------------------------------
        // 3. Verify booking status
        // -----------------------------------------

        if (booking.status !== "PENDING") {
          throw new BadRequestError(
            "Payment can only be created for a pending booking."
          );
        }

        // -----------------------------------------
        // 4. Check existing payment
        // -----------------------------------------

        const existingPayment =
          await paymentRepository.findByBookingId(
            tx,
            booking.id
          );

        if (existingPayment) {

          if (
            existingPayment.status ===
            "SUCCESS"
          ) {
            throw new BadRequestError(
              "This booking has already been paid."
            );
          }

          if (
            existingPayment.status ===
            "PENDING"
          ) {
            return existingPayment;
          }
        }

        // -----------------------------------------
        // 5. Generate payment reference
        // -----------------------------------------

        const paymentReference =
          `PAY-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()}`;

        // -----------------------------------------
        // 6. Create Razorpay order
        // -----------------------------------------

        const gatewayPayment =
          await paymentGateway.createPayment({
            paymentReference,

            amount:
              booking.totalAmount,

            currency:
              "INR",

            method:
              dto.method,
          });

        // -----------------------------------------
        // 7. Create payment record
        // -----------------------------------------

        const payment =
          await paymentRepository.create(
            tx,
            {
              bookingId:
                booking.id,

              paymentReference,

              gatewayOrderId:
                gatewayPayment.gatewayOrderId,

              amount:
                booking.totalAmount,

              currency:
                "INR",

              method:
                dto.method,

              status:
                "PENDING",
            }
          );

        return payment;
      }
    );

    // -----------------------------------------
    // 8. Return checkout information
    // -----------------------------------------

    return {
      id: result.id,

      bookingId:
        result.bookingId,

      paymentReference:
        result.paymentReference,

      gatewayOrderId:
        result.gatewayOrderId!,

      amount:
        result.amount,

      currency:
        result.currency,

      method:
        result.method,

      status:
        result.status,

      createdAt:
        result.createdAt,
    };
  }
}

export const paymentService =
  new PaymentService();