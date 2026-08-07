import { and, eq } from "drizzle-orm";

import { payments } from "./payment.schema.js";
import { DBClient } from "../../database/types.js";

class PaymentRepository {
  async create(client: DBClient, data: typeof payments.$inferInsert) {
    const [payment] = await client.insert(payments).values(data).returning();

    return payment;
  }

  async findById(client: DBClient, paymentId: string) {
    const [payment] = await client
      .select()
      .from(payments)
      .where(eq(payments.id, paymentId));

    return payment;
  }

  async findByBookingId(client: DBClient, bookingId: string) {
    const [payment] = await client
      .select()
      .from(payments)
      .where(eq(payments.bookingId, bookingId));

    return payment;
  }

  async findByGatewayOrderId(client: DBClient, gatewayOrderId: string) {
    const [payment] = await client
      .select()
      .from(payments)
      .where(eq(payments.gatewayOrderId, gatewayOrderId));

    return payment;
  }

  async findByGatewayPaymentId(client: DBClient, gatewayPaymentId: string) {
    const [payment] = await client
      .select()
      .from(payments)
      .where(eq(payments.gatewayPaymentId, gatewayPaymentId));

    return payment;
  }

  async update(
    client: DBClient,
    paymentId: string,
    data: Partial<typeof payments.$inferInsert>,
  ) {
    const [payment] = await client
      .update(payments)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, paymentId))
      .returning();

    return payment;
  }
}

export const paymentRepository = new PaymentRepository();
