//studentperformance.service.js
import StudentPerformance from "../models/studentperformance.models.js";

const getStudentPerformance = async (studentId) => {
  return await StudentPerformance.findAll({
    where: {
      student_id: studentId,
    },
    order: [["createdAt", "ASC"]],
  });
};

export default {
  getStudentPerformance,
};