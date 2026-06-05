//studentFaculty.routes.js
import express from "express";
import controller from "../controller/studentFaculty.controller.js";

const router = express.Router();

router.get(
  "/:studentId/faculties",
  controller.getStudentFaculties
);

export default router;