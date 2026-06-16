//syllabus.routes.js
import express from "express";
import controller from "../controller/syllabus.controller.js";

const router = express.Router();

router.get(
  "/:teacherId",
  controller.getTeacherSyllabus
);

export default router;