//studentFaculty.controller.js
import service from "../service/studentFaculty.service.js";

const getStudentFaculties = async (req, res) => {
  try {
    const { studentId } = req.params;

    const data =
      await service.getStudentFaculties(studentId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getStudentFaculties,
};