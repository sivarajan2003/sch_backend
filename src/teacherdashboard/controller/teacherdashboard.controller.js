//teacherdashboard.controller.js
import service from "../service/teacherdashboard.service.js";

const getTodayClasses = async (req, res) => {
  try {

    const { teacherId } = req.params;

    const data =
      await service.getTodayClasses(
        teacherId
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
  getTodayClasses,
};
