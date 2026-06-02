//dashboard.controller.js
import dashboardService from '../service/dashboard.service.js';

const getDashboardStats = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardStats();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  getDashboardStats,
};