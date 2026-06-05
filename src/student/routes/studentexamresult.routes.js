//studentexamresult.routes.js
import express from "express";
import controller from "../controller/studentexamresult.controller.js";

const router = express.Router();

router.post(
  "/",
  controller.createExamResult
);

router.get(
  "/:studentId",
  controller.getStudentExamResult
);

export default router;