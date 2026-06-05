//studentFaculty.service.js
import StudentFaculty from "../models/studentFaculty.models.js";

const getStudentFaculties = async (studentId) => {
  return await StudentFaculty.findAll({
    where: {
      student_id: studentId,
    },
  });
};

export default {
  getStudentFaculties,
};