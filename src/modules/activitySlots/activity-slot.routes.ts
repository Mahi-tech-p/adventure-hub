import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";

import { activitySlotController } from "./activity-slot.controller.js";
import { createActivitySlotSchema } from "./activity-slot.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createActivitySlotSchema),
  asyncHandler(activitySlotController.createSlot)
);

export default router;