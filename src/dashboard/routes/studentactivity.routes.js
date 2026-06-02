//studentactivity.routes.js
import express from "express";
import controller
from "../controller/studentactivity.controller.js";

const router = express.Router();

router.get(
  "/dashboard/student-activity",
  controller.getActivities
);

export default router;