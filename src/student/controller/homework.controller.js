//homework.controller.js
import homeworkService from "../service/homework.service.js";

const createHomework = async (req, res) => {
  try {
    const homework = await homeworkService.createHomework(
      req.body
    );

    res.status(201).json({
      success: true,
      data: homework,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getStudentHomework = async (req, res) => {
  try {
    const { studentId } = req.params;

    const data =
      await homeworkService.getStudentHomework(
        studentId
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
  createHomework,
  getStudentHomework,
};