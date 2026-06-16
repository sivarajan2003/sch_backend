//studentsyllabus.service.js
import StudentSyllabus from "../models/studentsyllabus.models.js";

const getStudentSyllabus = async (studentId) => {
  return await StudentSyllabus.findAll({
    where: {
      student_id: studentId,
    },
  });
};

export default {
  getStudentSyllabus,
};