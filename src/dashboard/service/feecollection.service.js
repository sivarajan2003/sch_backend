//feecollection.service.js
import FeePayment from '../../admission/models/feepayment.models.js';

const getFeeCollection = async () => {
  const rows = await FeePayment.findAll({
    order: [['payment_date', 'ASC']],
  });

  return rows.map((row) => ({
    label: new Date(row.payment_date).toLocaleDateString(),
    total: Number(row.total_amount || 0),
    collected: Number(row.registration_fee || 0),
  }));
};

export default {
  getFeeCollection,
};