import express from "express";

import hrRoutes from "./hr.routes.js";
import teacherRoutes from "./teacher.routes.js";
import attendanceRoutes from "./attendance.routes.js";

const router = express.Router();

// HR
router.use("/hr", hrRoutes);

// Teacher
router.use("/teacher", teacherRoutes);

// Attendance
router.use("/attendance", attendanceRoutes);

export default router;