//performance.controller.js
import service from "../service/performance.service.js";

const getBestPerformers = async (req, res) => {
  try {

    const data =
      await service.getBestPerformers();

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getStudentProgress = async (
  req,
  res
) => {
  try {

    const data =
      await service.getStudentProgress();

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export default {
  getBestPerformers,
  getStudentProgress
};