//calender.routes.js
import express from "express";
import controller from "../controller/calendar.controller.js";

const router = express.Router();

router.get(
  "/dashboard/calendar",
  controller.getEvents
);

router.post(
  "/dashboard/calendar",
  controller.createEvent
);

export default router;