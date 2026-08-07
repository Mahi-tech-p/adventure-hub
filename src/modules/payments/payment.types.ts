export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface PaymentResponseDto {
  id: string;
  bookingId: string;
  paymentReference: string;
  gatewayOrderId: string;
  amount: string;
  currency: string;
  method: PaymentMethod;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  createdAt: Date;
}
export type PaymentMethod = "RAZORPAY" | "STRIPE";
