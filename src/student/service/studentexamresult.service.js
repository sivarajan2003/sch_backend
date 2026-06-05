//studentexamresult.service.js
import StudentExamResult from "../models/studentexamresult.models.js";

const createExamResult = async (payload) => {
  return await StudentExamResult.create(payload);
};

const getStudentExamResult = async (
  studentId
) => {
  return await StudentExamResult.findAll({
    where: {
      student_id: studentId,
    },
    order: [["createdAt", "DESC"]],
  });
};

export default {
  createExamResult,
  getStudentExamResult,
};