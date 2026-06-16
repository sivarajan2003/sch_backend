//studentMarks.routes.js
import express from "express";
import controller from "../controller/dashboard.controller.js";

const router = express.Router();

router.get(
  "/teacher-dashboard/student-marks",
  controller.getStudentMarks
);

export default router;