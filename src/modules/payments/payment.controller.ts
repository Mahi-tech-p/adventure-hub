import { Request, Response } from "express";

import { paymentService } from "./payment.service.js";
import { CreatePaymentDto } from "./payment.dto.js";

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
}

export const paymentController =
  new PaymentController();