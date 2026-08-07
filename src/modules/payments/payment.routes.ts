import { Router } from "express";

import { paymentController } from "./payment.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createPaymentSchema, verifyPaymentSchema } from "./payment.validation.js";
import { authenticate } from "../../middlewares/authenticate.js";

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
export default router;