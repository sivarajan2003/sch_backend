import express from "express";
import controller from "../controller/upcomingevent.controller.js";

const router = express.Router();

router.get(
  "/dashboard/upcoming-events",
  controller.getUpcomingEvents
);

router.post(
  "/dashboard/upcoming-events",
  controller.createUpcomingEvent
);

export default router;