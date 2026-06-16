//teacherAttendance.routes.js
import express from "express";

import controller
from "../controller/teacherAttendance.controller.js";

const router = express.Router();

router.get(
  "/teacher-attendance/:teacherId",
  controller.getTeacherAttendance
);

export default router;