import { Router } from "express";

import { paymentController } from "./payment.controller.js";

const router = Router();

router.post(
  "/",
  paymentController.handleWebhook
);

export default router;