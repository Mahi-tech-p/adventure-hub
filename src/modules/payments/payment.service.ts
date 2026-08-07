import { eq } from "drizzle-orm";

import { db } from "../../database/db.js";

import { BadRequestError } from "../../Errors/BadRequestError.js";
import { NotFoundError } from "../../Errors/NotFoundError.js";

import { bookings } from "../bookings/booking.schema.js";

import { CreatePaymentDto, RazorpayWebhookDto, VerifyPaymentDto } from "./payment.dto.js";

import { PaymentResponseDto } from "./payment.types.js";
import { paymentGateway } from "./razorpay.getway.js";
import { paymentRepository } from "./payment.respository.js";

class PaymentService {
  async createPayment(
    userId: string,
    dto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const result = await db.transaction(async (tx) => {
      // -----------------------------------------
      // 1. Find booking
      // -----------------------------------------

      const [booking] = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.id, dto.bookingId));

      if (!booking) {
        throw new NotFoundError("Booking not found.");
      }

      // -----------------------------------------
      // 2. Verify ownership
      // -----------------------------------------

      if (booking.userId !== userId) {
        throw new BadRequestError(
          "You are not allowed to pay for this booking.",
        );
      }

      // -----------------------------------------
      // 3. Verify booking status
      // -----------------------------------------

      if (booking.status !== "PENDING") {
        throw new BadRequestError(
          "Payment can only be created for a pending booking.",
        );
      }

      // -----------------------------------------
      // 4. Check existing payment
      // -----------------------------------------

      const existingPayment = await paymentRepository.findByBookingId(
        tx,
        booking.id,
      );

      if (existingPayment) {
        if (existingPayment.status === "SUCCESS") {
          throw new BadRequestError("This booking has already been paid.");
        }

        if (existingPayment.status === "PENDING") {
          return existingPayment;
        }
      }

      // -----------------------------------------
      // 5. Generate payment reference
      // -----------------------------------------

      const paymentReference = `PAY-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      // -----------------------------------------
      // 6. Create Razorpay order
      // -----------------------------------------

      const gatewayPayment = await paymentGateway.createPayment({
        paymentReference,

        amount: booking.totalAmount,

        currency: "INR",

        method: dto.method,
      });

      // -----------------------------------------
      // 7. Create payment record
      // -----------------------------------------

      const payment = await paymentRepository.create(tx, {
        bookingId: booking.id,

        paymentReference,

        gatewayOrderId: gatewayPayment.gatewayOrderId,

        amount: booking.totalAmount,

        currency: "INR",

        method: dto.method,

        status: "PENDING",
      });

      return payment;
    });

    // -----------------------------------------
    // 8. Return checkout information
    // -----------------------------------------

    return {
      id: result.id,

      bookingId: result.bookingId,

      paymentReference: result.paymentReference,

      gatewayOrderId: result.gatewayOrderId!,

      amount: result.amount,

      currency: result.currency,

      method: result.method,

      status: result.status,

      createdAt: result.createdAt,
    };
  }
  async verifyPayment(userId: string, dto: VerifyPaymentDto) {
    const payment = await paymentRepository.findByGatewayOrderId(
      db,
      dto.razorpayOrderId,
    );

    if (!payment) {
      throw new NotFoundError("Payment not found.");
    }

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, payment.bookingId));

    if (!booking) {
      throw new NotFoundError("Booking not found.");
    }

    if (booking.userId !== userId) {
      throw new BadRequestError("You are not allowed to verify this payment.");
    }

    if (payment.status === "SUCCESS") {
      return payment;
    }

    if (payment.status !== "PENDING") {
      throw new BadRequestError("Payment cannot be verified.");
    }

    const isValid = await paymentGateway.verifyPayment(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );

    if (!isValid) {
      await paymentRepository.update(db, payment.id, {
        status: "FAILED",
        failureReason: "Invalid Razorpay payment signature.",
      });

      throw new BadRequestError("Invalid payment signature.");
    }

    const result = await db.transaction(async (tx) => {
      const updatedPayment = await paymentRepository.update(tx, payment.id, {
        gatewayPaymentId: dto.razorpayPaymentId,

        status: "SUCCESS",

        paidAt: new Date(),
      });

      await tx
        .update(bookings)
        .set({
          status: "CONFIRMED",
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, payment.bookingId));

      return updatedPayment;
    });

    return result;
  }
  async handleWebhook(payload: RazorpayWebhookDto) {
  const event = payload.event;

  if (
    event !== "payment.captured" &&
    event !== "payment.failed"
  ) {
    return;
  }

  const paymentEntity =
    payload.payload.payment.entity;

  const gatewayOrderId =
    paymentEntity.order_id;

  const gatewayPaymentId =
    paymentEntity.id;

  const payment =
    await paymentRepository.findByGatewayOrderId(
      db,
      gatewayOrderId
    );

  if (!payment) {
    throw new NotFoundError(
      "Payment associated with this Razorpay order was not found."
    );
  }


  if (payment.status === "SUCCESS") {
    return payment;
  }


  if (event === "payment.captured") {
    return await db.transaction(async (tx) => {
      const updatedPayment =
        await paymentRepository.update(
          tx,
          payment.id,
          {
            gatewayPaymentId,
            status: "SUCCESS",
            paidAt: new Date(),
          }
        );

      await tx
        .update(bookings)
        .set({
          status: "CONFIRMED",
          updatedAt: new Date(),
        })
        .where(
          eq(
            bookings.id,
            payment.bookingId
          )
        );

      return updatedPayment;
    });
  }


  if (event === "payment.failed") {
    return await paymentRepository.update(
      db,
      payment.id,
      {
        gatewayPaymentId,
        status: "FAILED",
        failureReason:
          "Razorpay payment failed.",
      }
    );
  }
}
}

export const paymentService = new PaymentService();
