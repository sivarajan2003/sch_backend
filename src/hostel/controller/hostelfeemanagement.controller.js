import service from '../service/hostelfeemanagement.service.js';

const createFee = async (
  req,
  res
) => {

  try {

    const data =
      await service.createFee(req.body);

    res.status(201).json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFees = async (
  req,
  res
) => {

  try {

    const data =
      await service.getFees();

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateFee = async (
  req,
  res
) => {

  try {

    const data =
      await service.updateFee(
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteFee = async (
  req,
  res
) => {

  try {

    await service.deleteFee(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Deleted Successfully',
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createFee,
  getFees,
  updateFee,
  deleteFee,
};