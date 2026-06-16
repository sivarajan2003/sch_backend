//leaveStatus.routes.js
import express from "express";
import controller from "../controller/dashboard.controller.js";

const router = express.Router();

router.get(
  "/teacher-dashboard/leave-status",
  controller.getLeaveStatus
);

export default router;