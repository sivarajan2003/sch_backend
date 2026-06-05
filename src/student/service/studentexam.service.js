//studentexam.service.js
import StudentExam from "../models/studentexam.models.js";

const createExam = async (payload) => {
  return await StudentExam.create(payload);
};

const getStudentExams = async (studentId) => {
  return await StudentExam.findAll({
    where: { student_id: studentId },
    order: [["exam_date", "ASC"]],
  });
};

export default {
  createExam,
  getStudentExams,
};