//studentexam.controller.js
import service from "../service/studentexam.service.js";

const createExam = async (req, res) => {
  try {
    const exam = await service.createExam(req.body);

    return res.status(201).json({
      success: true,
      data: exam,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getStudentExams = async (req, res) => {
  try {
    const { studentId } = req.params;

    const exams =
      await service.getStudentExams(studentId);

    return res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  createExam,
  getStudentExams,
};