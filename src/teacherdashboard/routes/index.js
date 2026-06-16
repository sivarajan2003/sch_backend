import express from "express";
import dashboardRoutes from "./teacherdashboard.routes.js";
import eventController from "../controller/event.controller.js";
import teacherAttendanceRoutes from "./teacherAttendance.routes.js";
import performanceRoutes from "./performance.routes.js";
import syllabusRoutes from "./syllabus.routes.js";
import studentMarksRoutes from "./studentMarks.routes.js";
import leaveStatusRoutes from "./leaveStatus.routes.js";
import dashboardCardRoutes
from "./dashboardCard.routes.js";

const router = express.Router();

router.use(
  "/teacher-dashboard",
  dashboardRoutes
);

router.get(
  "/teacher-dashboard/upcoming-events",
  eventController.getUpcomingEvents
);

router.use(
  "/teacher-dashboard",
  teacherAttendanceRoutes
);
router.use(
 "/teacher-dashboard",
 performanceRoutes
);
router.use(
 "/teacher-dashboard/syllabus",
 syllabusRoutes
);
router.use(
 "/teacher-dashboard",
 studentMarksRoutes
);

router.use(
 "/teacher-dashboard",
 leaveStatusRoutes
);

router.use(
 "/teacher-dashboard",
 dashboardCardRoutes
);
export default router;