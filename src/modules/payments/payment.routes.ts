import { Router } from "express";

import { paymentController } from "./payment.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createPaymentSchema } from "./payment.validation.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createPaymentSchema),
  paymentController.createPayment
);

export default router;