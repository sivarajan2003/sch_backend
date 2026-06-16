//performance.routes.js
import express from "express";
import controller from "../controller/performance.controller.js";

const router = express.Router();

router.get(
  "/best-performers",
  controller.getBestPerformers
);

router.get(
  "/student-progress",
  controller.getStudentProgress
);

export default router;