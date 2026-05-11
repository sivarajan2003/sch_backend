import Fees from '../models/fees.model.js';

const createFees = async (payload) => {
  return await Fees.create(payload);
};

const getFees = async () => {
  return await Fees.findAll();
};

const updateFees = async (id, payload) => {
  await Fees.update(payload, {
    where: { id }
  });

  return await Fees.findByPk(id);
};

const deleteFees = async (id) => {
  return await Fees.destroy({
    where: { id }
  });
};

export default {
  createFees,
  getFees,
  updateFees,
  deleteFees
};