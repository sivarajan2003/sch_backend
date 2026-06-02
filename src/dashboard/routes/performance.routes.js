//performance.routes.js
import express from "express";
import controller from "../controller/performance.controller.js";

const router = express.Router();

router.get(
  "/performance",
  controller.getPerformance
);

router.get(
  "/performance/:className",
  controller.getPerformanceClass
);

export default router;
