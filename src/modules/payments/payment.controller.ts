import { Request, Response } from "express";

import { paymentService } from "./payment.service.js";
import { CreatePaymentDto, VerifyPaymentDto } from "./payment.dto.js";
import { verifyRazorpayWebhook } from "./razorpay.webhook.js";

class PaymentController {
  async createPayment(
    req: Request<{}, {}, CreatePaymentDto>,
    res: Response
  ) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payment =
      await paymentService.createPayment(
        userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully.",
      data: payment,
    });
  }
  async verifyPayment(
  req: Request<{}, {}, VerifyPaymentDto>,
  res: Response
) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const payment =
    await paymentService.verifyPayment(
      userId,
      req.body
    );

  return res.status(200).json({
    success: true,
    message: "Payment verified successfully.",
    data: payment,
  });
}
async handleWebhook(
  req: Request,
  res: Response
) {
  const signature =
    req.headers[
      "x-razorpay-signature"
    ];

  if (
    typeof signature !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Missing Razorpay webhook signature.",
    });
  }

  const rawBody = req.body as Buffer;

  const isValid =
    verifyRazorpayWebhook(
      rawBody,
      signature
    );

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid webhook signature.",
    });
  }

  const payload =
    JSON.parse(
      rawBody.toString("utf-8")
    );

  await paymentService.handleWebhook(
    payload
  );

  return res.status(200).json({
    success: true,
  });
}
}

export const paymentController =
  new PaymentController();