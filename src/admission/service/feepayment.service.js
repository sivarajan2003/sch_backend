//feepayment.service.js
import FeePayment from '../models/feepayment.models.js';
import Admission from '../../admission/models/admission.models.js';


const createFeePayment = async (payload, { transaction = null } = {}) => {
  // 1️⃣ Check admission_id exists
  const admissionExists = await Admission.findByPk(
    payload.admission_id,
    { transaction }
  );

  if (!admissionExists) {
    throw new Error('Invalid admission_id: Admission does not exist');
  }

  // 2️⃣ Create fee payment only if admission exists
  return FeePayment.create(payload);

};
const getFeePayments = async ({ page = 1, limit = 10 }) => {
  const pageNum = Number(page);
  const limitNum = Number(limit);

  const { rows, count } = await FeePayment.findAndCountAll({
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
    order: [['createdAt', 'DESC']],
  });

  return {
    rows,
    count,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(count / limitNum),
  };
};


const getFeePaymentById = async (id) => {
  const data = await FeePayment.findByPk(id);
  if (!data) throw new Error('Fee Payment not found');
  return data;
};

const updateFeePayment = async (id, payload) => {
  const [count] = await FeePayment.update(payload, { where: { id } });
  if (!count) throw new Error('Fee Payment not found');
  return FeePayment.findByPk(id);
};

const deleteFeePayment = async (id) => {
  const data = await FeePayment.findByPk(id);
  if (!data) throw new Error('Fee Payment not found');
  await data.destroy();

};

export default {
  createFeePayment,
  getFeePayments,
  getFeePaymentById,
  updateFeePayment,
  deleteFeePayment,
};
