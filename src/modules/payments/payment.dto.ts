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

export interface RazorpayWebhookDto {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: string;
      };
    };
  };
}