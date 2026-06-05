//studentperformance.routes.js
import express from "express";
import controller from "../controller/studentperformance.controller.js";

const router = express.Router();

router.get("/:studentId", controller.getStudentPerformance);

export default router;