import crypto from "crypto";

export function verifyRazorpayWebhook(
  rawBody: Buffer,
  signature: string
): boolean {
  const secret =
    process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      "RAZORPAY_WEBHOOK_SECRET is not configured."
    );
  }

  const expectedSignature =
    crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

  const expected =
    Buffer.from(expectedSignature);

  const received =
    Buffer.from(signature);

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    expected,
    received
  );
}