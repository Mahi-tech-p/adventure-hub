import { Router } from "express";

import { authController } from "./auth.controller.js";


import { loginSchema, refreshTokenSchema, registerSchema } from "./auth.validation.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";


const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register)
);

router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(authController.login)
)

router.post("/refresh-token",
  validate(refreshTokenSchema),
  asyncHandler(authController.refreshToken)
)
export default router;