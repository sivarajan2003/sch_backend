//attendance.routes.js
import express from "express";
import controller from "../controller/attendance.controller.js";

const router = express.Router();
console.log("attendance.routes loaded");
router.get(
  "/attendance-dashboard",
  controller.getAttendanceStats
);

export default router;