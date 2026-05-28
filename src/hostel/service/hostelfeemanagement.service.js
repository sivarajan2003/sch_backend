//hostelfeemanagement.service.js
import HostelFeeManagement from '../models/hostelfeemanagement.models.js';

const createFee = async (payload) => {

  const count =
    await HostelFeeManagement.count();

  const fee =
    await HostelFeeManagement.create({
      ...payload,

      fee_id: `HF${1001 + count}`,
    });

  return fee;
};

const getFees = async () => {

  return await HostelFeeManagement.findAll({
    order: [['createdAt', 'DESC']],
  });
};

const updateFee = async (
  id,
  payload
) => {

  await HostelFeeManagement.update(
    payload,
    {
      where: { id },
    }
  );

  return await HostelFeeManagement.findByPk(
    id
  );
};

const deleteFee = async (id) => {

  return await HostelFeeManagement.destroy({
    where: { id },
  });
};
const getFeeById = async (id) => {

  return await HostelFeeManagement.findByPk(
    id
  );

};
export default {
  createFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
};