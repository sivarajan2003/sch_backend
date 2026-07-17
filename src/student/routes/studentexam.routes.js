// studentexam.routes.js
import express from "express";
import controller from "../controller/studentexam.controller.js";

const router = express.Router();

// GET all exams (admin/teacher view)
router.get("/", controller.getAllExams);

// GET exams for a specific student
router.get("/student/:studentId", controller.getStudentExams);

// GET single exam by id
router.get("/:id", controller.getExamById);

// CREATE exam
router.post("/", controller.createExam);

// UPDATE exam
router.put("/:id", controller.updateExam);

// DELETE exam
router.delete("/:id", controller.deleteExam);

export default router;
