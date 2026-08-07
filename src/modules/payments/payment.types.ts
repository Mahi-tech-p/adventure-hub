export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

export type PaymentMethod =
  | "RAZORPAY"
  | "STRIPE";