import { PaymentMethod } from "./payment.types.js";

export interface CreateGatewayPaymentInput {
  paymentReference: string;
  amount: string;
  currency: string;
  method: PaymentMethod;
}

export interface GatewayPaymentResult {
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
}

export interface PaymentGateway {
  createPayment(
    input: CreateGatewayPaymentInput
  ): Promise<GatewayPaymentResult>;

  verifyPayment(
    gatewayOrderId: string,
    gatewayPaymentId: string,
    signature: string
  ): Promise<boolean>;
}