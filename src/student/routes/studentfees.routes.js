//studentfees.routes.js
import express from "express";
import controller from "../controller/studentfees.controller.js";

const router = express.Router();

router.get(
  "/:studentId",
  controller.getStudentFees
);

export default router;