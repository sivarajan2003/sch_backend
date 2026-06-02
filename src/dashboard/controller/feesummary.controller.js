//feesummary.controller.js
import feeSummaryService from '../service/feesummary.service.js';

const getFeeSummary = async (req, res) => {
  try {
    const data = await feeSummaryService.getFeeSummary();

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
  getFeeSummary,
};