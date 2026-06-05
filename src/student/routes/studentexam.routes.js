//studentexam.routes.js
import express from "express";
import controller from "../controller/studentexam.controller.js";

const router = express.Router();

router.post(
  "/",
  controller.createExam
);

router.get(
  "/",
  controller.getStudentExams
);

export default router;