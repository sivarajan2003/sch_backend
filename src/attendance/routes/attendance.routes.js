import express from "express";

import hrRoutes from "./hr.routes.js";
import teacherRoutes from "./teacher.routes.js";
import attendanceRoutes from "../attendance/routes/attendance.routes.js";

const router = express.Router();

router.use("/hr", hrRoutes);

router.use("/teacher", teacherRoutes);

router.use("/attendance", attendanceRoutes);

export default router;