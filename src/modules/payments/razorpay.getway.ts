import crypto from "crypto";

import { razorpay } from "../../config/razorpay.js";

import {
  CreateGatewayPaymentInput,
  GatewayPaymentResult,
  PaymentGateway,
} from "./payment.gateway.js";

export class RazorpayGateway implements PaymentGateway {
  async createPayment(
    input: CreateGatewayPaymentInput,
  ): Promise<GatewayPaymentResult> {
    const amountInSubunits = Math.round(Number(input.amount) * 100);

    const order = await razorpay.orders.create({
      amount: amountInSubunits,
      currency: input.currency,
      receipt: input.paymentReference,
      partial_payment: false,
    });

    return {
      gatewayOrderId: order.id,
      status: "PENDING",
    };
  }

  async verifyPayment(
    gatewayOrderId: string,
    gatewayPaymentId: string,
    signature: string,
  ): Promise<boolean> {
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error("RAZORPAY_KEY_SECRET is not configured.");
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${gatewayOrderId}|${gatewayPaymentId}`)
      .digest("hex");

    const expected = Buffer.from(generatedSignature);

    const received = Buffer.from(signature);

    if (expected.length !== received.length) {
      return false;
    }

    return crypto.timingSafeEqual(expected, received);
  }
}

export const paymentGateway = new RazorpayGateway();
