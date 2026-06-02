//feecollection.controller.js
import feeCollectionService from '../service/feecollection.service.js';

const getFeeCollection = async (req, res) => {
  try {
    const data = await feeCollectionService.getFeeCollection();

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
  getFeeCollection,
};