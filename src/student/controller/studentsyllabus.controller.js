//studentsyllabus.controller.js
import service from "../service/studentsyllabus.service.js";

const getByStudent = async (req, res) => {
  const data = await service.getStudentSyllabus(
    req.params.studentId
  );

  res.status(200).json({
    success: true,
    data,
  });
};

export default {
  getByStudent,
};