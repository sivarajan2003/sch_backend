//studentfees.service.js
import StudentFees from "../models/studentfees.models.js";

const getStudentFees = async (
  studentId
) => {
  return await StudentFees.findAll({
    where: {
      student_id: studentId,
    },
    order: [["createdAt", "DESC"]],
  });
};

export default {
  getStudentFees,
};