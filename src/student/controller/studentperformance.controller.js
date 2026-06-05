//studentperformance.controller.js
import service from "../service/studentperformance.service.js";

const getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const data = await service.getStudentPerformance(studentId);

    if (!data.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No Performance Found",
      });
    }

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
  getStudentPerformance,
};