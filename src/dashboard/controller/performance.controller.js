//performance.controller.js
import service from "../service/performance.service.js";

const getPerformance = async (
  req,
  res
) => {
  try {
    const data =
      await service.getAllPerformance();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getPerformanceClass = async (
  req,
  res
) => {
  try {
    const { className } = req.params;

    const data =
      await service.getPerformanceByClass(
        className
      );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  getPerformance,
  getPerformanceClass,
};