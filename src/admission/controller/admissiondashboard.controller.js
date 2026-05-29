// admissiondashboard.controller.js
import admissionDashboardService from '../service/admissiondashboard.service.js';

/* ============================
   DASHBOARD SUMMARY STATS
============================ */

const getDashboardStats = async (req, res) => {
  try {
    const stats = await admissionDashboardService.getDashboardStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error('getDashboardStats error:', err);

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   ADMISSION FUNNEL
============================ */

const getAdmissionFunnel = async (req, res) => {
  try {
    const funnel = await admissionDashboardService.getAdmissionFunnel();

    return res.status(200).json({
      success: true,
      data: funnel,
    });
  } catch (err) {
    console.error('getAdmissionFunnel error:', err);

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   CLASS CAPACITY
============================ */

const getClassCapacity = async (req, res) => {
  try {
    const capacity = await admissionDashboardService.getClassCapacity();

    return res.status(200).json({
      success: true,
      data: capacity,
    });
  } catch (err) {
    console.error('getClassCapacity error:', err);

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   RECENT APPLICATIONS
============================ */

const getRecentApplications = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const applications =
      await admissionDashboardService.getRecentApplications(limit);

    return res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (err) {
    console.error('getRecentApplications error:', err);

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   EXPORTS
============================ */

export default {
  getDashboardStats,
  getAdmissionFunnel,
  getClassCapacity,
  getRecentApplications,
};
