import { Router } from "express";

import { parkController } from "./park.controller.js";
import { createParkSchema, getParksSchema, updateParkSchema } from "./park.validation.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createParkSchema),
  asyncHandler(parkController.createPark)
);

router.patch(
  "/:id",
  authenticate,
  validate(updateParkSchema),
  asyncHandler(
    parkController.updatePark
  )
);

router.get(
  "/",
  validate(getParksSchema, "query"),
  asyncHandler(parkController.getparks)
);

export default router;