//syllabus.controller.js
import syllabusService from "../service/syllabus.service.js";

const getTeacherSyllabus = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const data =
      await syllabusService.getTeacherSyllabus(
        teacherId
      );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  getTeacherSyllabus,
};