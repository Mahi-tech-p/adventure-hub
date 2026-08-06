import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import parkRoutes from "../modules/parks/park.routes.js";
import activityRoutes from "../modules/activities/activity.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.use("/parks", parkRoutes);

router.use("/activities", activityRoutes);

export default router;
