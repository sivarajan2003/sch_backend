import express from "express";
import dashboardRoutes from "./dashboard.routes.js";
import feeCollectionRoutes from "./feecollection.routes.js";
import leaveRoutes from "./leave.routes.js";
import calendarRoutes from "./calender.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import upcomingEventRoutes from "./upcomingevent.routes.js";
import performanceRoutes from "./performance.routes.js";
import noticeboardRoutes from "./noticeboard.routes.js";
import feeSummaryRoutes from './feesummary.routes.js';



import topSubjectRoutes
from "./topsubject.routes.js";

import studentActivityRoutes
from "./studentactivity.routes.js";

import todoRoutes
from "./todo.routes.js";








const router = express.Router();

router.use("/", dashboardRoutes);
router.use("/", feeCollectionRoutes);
router.use("/", leaveRoutes);
router.use("/", calendarRoutes);
router.use("/", attendanceRoutes);
router.use("/", upcomingEventRoutes);
router.use("/", performanceRoutes);
router.use("/", noticeboardRoutes);
router.use('/', feeSummaryRoutes);
router.use("/", topSubjectRoutes);
router.use("/", studentActivityRoutes);
router.use("/", todoRoutes);


export default router;