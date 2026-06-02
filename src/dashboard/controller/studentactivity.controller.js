//studentactivity.controller.js
import service from "../service/studentactivity.service.js";

const getActivities = async (req, res) => {
  try {
    const data =
      await service.getActivities();

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
  getActivities,
};