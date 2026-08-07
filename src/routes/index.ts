import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import parkRoutes from "../modules/parks/park.routes.js";
import activityRoutes from "../modules/activities/activity.routes.js";
import activitySlotRoutes from "../modules/activitySlots/activity-slot.routes.js";
import bookingRoutes from "../modules/bookings/booking.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.use("/parks", parkRoutes);

router.use("/activities", activityRoutes);

router.use("/activity-slots", activitySlotRoutes);

router.use("/bookings", bookingRoutes);

router.use("/payments", paymentRoutes);
export default router;
