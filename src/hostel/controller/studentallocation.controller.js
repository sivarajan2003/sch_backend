import service from '../service/studentallocation.service.js';
const createAllocation = async (
  req,
  res
) => {
  try {

    const data =
      await service.createAllocation(
        req.body
      );

    return res.status(201).json({
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

const getAllocations = async (
  req,
  res
) => {
  try {

    const rows =
      await service.getAllocations();

    return res.status(200).json({
      success: true,
      rows,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

const updateAllocation = async (
  req,
  res
) => {
  try {

    const data =
      await service.updateAllocation(
        req.params.id,
        req.body
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

const deleteAllocation = async (
  req,
  res
) => {
  try {

    await service.deleteAllocation(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: 'Deleted',
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

export default {
  createAllocation,
  getAllocations,
  updateAllocation,
  deleteAllocation,
};