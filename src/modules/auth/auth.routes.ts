import { Router } from "express";

import { authController } from "./auth.controller.js";


import { registerSchema } from "./auth.validation.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";


const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register)
);

export default router;