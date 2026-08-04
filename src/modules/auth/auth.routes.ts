import { Router } from "express";

import { authController } from "./auth.controller.js";


import { loginSchema, logoutSchema, refreshTokenSchema, registerSchema } from "./auth.validation.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";


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

router.get("/me",authenticate,asyncHandler(authController.me))

router.post("/logout",authenticate,validate(logoutSchema), asyncHandler(authController.logout))

router.post("/logout-all", authenticate, asyncHandler(authController.logoutAll))
export default router;