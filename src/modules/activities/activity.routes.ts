import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";

import { activityController } from "./activity.controller.js";
import { createActivitySchema, getActivitiesSchema } from "./activity.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createActivitySchema),
  asyncHandler(activityController.createActivity)
);

router.get(
  "/",
  validate(getActivitiesSchema, "query"),
  asyncHandler(
    activityController.getActivities
  )
);

export default router;