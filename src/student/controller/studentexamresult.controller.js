//studentexamresult.controller.js
import service from "../service/studentexamresult.service.js";

const createExamResult = async (
  req,
  res
) => {
  try {
    const data =
      await service.createExamResult(
        req.body
      );

    res.status(201).json({
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

const getStudentExamResult = async (
  req,
  res
) => {
  try {
    const { studentId } = req.params;

    const data =
      await service.getStudentExamResult(
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
  createExamResult,
  getStudentExamResult,
};