//studentsyllabus.routes.js
import express from "express";
import controller from "../controller/studentsyllabus.controller.js";

const router = express.Router();

router.get(
  "/student/:studentId",
  controller.getByStudent
);

export default router;