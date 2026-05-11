import feesService from '../service/fees.service.js';

const createFees = async (req, res) => {
  const result =
    await feesService.createFees(req.body);

  return res.status(201).json({
    success: true,
    data: result
  });
};

const getFees = async (req, res) => {
  const result =
    await feesService.getFees();

  return res.status(200).json({
    success: true,
    data: result
  });
};

const updateFees = async (req, res) => {
  const result =
    await feesService.updateFees(
      req.params.id,
      req.body
    );

  return res.status(200).json({
    success: true,
    data: result
  });
};

const deleteFees = async (req, res) => {
  await feesService.deleteFees(
    req.params.id
  );

  return res.status(200).json({
    success: true
  });
};

export default {
  createFees,
  getFees,
  updateFees,
  deleteFees
};