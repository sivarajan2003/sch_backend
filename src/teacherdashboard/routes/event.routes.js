//event.routes.js
import express from "express";
import controller from "../controller/event.controller.js";

const router = express.Router();

router.get(
  "/upcoming-events",
  controller.getUpcomingEvents
);

export default router;