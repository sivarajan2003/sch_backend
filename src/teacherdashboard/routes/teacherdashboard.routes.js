import express from "express";
import controller from "../controller/teacherdashboard.controller.js";
import eventController from "../controller/event.controller.js";

const router = express.Router();

router.get(
  "/today-class/:teacherId",
  controller.getTodayClasses
);

router.get(
  "/upcoming-events",
  eventController.getUpcomingEvents
);

export default router;