import express from "express";
import dashboardRoutes from "./dashboard.routes.js";
import feeCollectionRoutes from './feecollection.routes.js';
import leaveRoutes from './leave.routes.js';
import calendarRoutes from './calendar.routes.js';
import attendanceRoutes from "./attendance.routes.js";


const router = express.Router();

router.use("/", dashboardRoutes);
router.use("/", feeCollectionRoutes);
router.use("/", leaveRoutes);
router.use("/", calendarRoutes);
router.use("/", attendanceRoutes);

export default router;