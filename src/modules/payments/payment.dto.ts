import { PaymentMethod } from "./payment.types.js";

export interface CreatePaymentDto {
  bookingId: string;
  method: PaymentMethod;
}

export interface PaymentWebhookDto {
  gatewayPaymentId: string;
  gatewayOrderId: string;
  status: "SUCCESS" | "FAILED";
  signature: string;
}
export interface VerifyPaymentDto {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}