// studentexam.controller.js
import service from "../service/studentexam.service.js";

const createExam = async (req, res) => {
  try {
    const exam = await service.createExam(req.body);
    return res.status(201).json({ success: true, data: exam });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET all exams (admin view — no studentId filter)
const getAllExams = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const exams = await service.getAllExams({ search, page, limit });
    return res.status(200).json({ success: true, data: exams });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET exams for a specific student
const getStudentExams = async (req, res) => {
  try {
    const { studentId } = req.params;
    const exams = await service.getStudentExams(studentId);
    return res.status(200).json({ success: true, data: exams });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await service.getExamById(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
    return res.status(200).json({ success: true, data: exam });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await service.updateExam(req.params.id, req.body);
    return res.status(200).json({ success: true, data: exam });
  } catch (err) {
    const status = err.message.includes("not found") ? 404 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    await service.deleteExam(req.params.id);
    return res.status(200).json({ success: true, message: "Exam deleted" });
  } catch (err) {
    const status = err.message.includes("not found") ? 404 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

export default {
  createExam,
  getAllExams,
  getStudentExams,
  getExamById,
  updateExam,
  deleteExam,
};
