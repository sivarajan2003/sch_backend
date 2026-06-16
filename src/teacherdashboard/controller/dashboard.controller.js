//dashboard.controller.js
import service from "../service/dashboard.service.js";

const getStudentMarks = async (req, res) => {
  try {
    const data =
      await service.getStudentMarks();

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

const getLeaveStatus = async (req, res) => {
  try {
    const data =
      await service.getLeaveStatus();

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
  getStudentMarks,
  getLeaveStatus,
};