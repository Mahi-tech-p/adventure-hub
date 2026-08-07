import { Router } from "express";
import express from "express"

import { paymentController } from "./payment.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createPaymentSchema, verifyPaymentSchema } from "./payment.validation.js";
import { authenticate } from "../../middlewares/authenticate.js";
import  paymentWebhookRoutes from "./payment.webhook.routes.js"
const router = Router();

router.post(
  "/",
  authenticate,
  validate(createPaymentSchema),
  paymentController.createPayment
);
router.post(
  "/verify",
  authenticate,
  validate(verifyPaymentSchema),
  paymentController.verifyPayment
);
router.use(
  "/api/v1/payments/webhook",
  express.raw({
    type: "application/json",
  }),
  paymentWebhookRoutes
);

export default router;