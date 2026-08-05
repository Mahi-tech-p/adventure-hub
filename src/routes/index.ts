import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js"
import parkRoutes from "../modules/parks/park.routes.js"
const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes)

router.use("/parks",parkRoutes)

export default router;