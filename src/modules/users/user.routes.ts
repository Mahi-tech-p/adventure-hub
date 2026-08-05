import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { userController } from "./user.controller.js";
import { validate } from "../../middlewares/validate.js";
import { updateProfileSchema } from "./user.validation.js";
import { upload } from "../../shared/storage/multer.js";

const router = Router();

router.get("/profile", authenticate,asyncHandler(userController.getProfile))

router.patch('/profile',authenticate, validate(updateProfileSchema), asyncHandler(userController.updateProfile))

router.post("/avatar", authenticate,upload.single("avatar"),asyncHandler(userController.updateAvatar))


export default router