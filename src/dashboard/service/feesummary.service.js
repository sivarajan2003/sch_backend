//feesummary.service.js
import FeePayment from '../../admission/models/feepayment.models.js';

const getFeeSummary = async () => {
  const rows = await FeePayment.findAll();

  const totalFeesCollected = rows.reduce(
    (sum, row) => sum + Number(row.total_amount || 0),
    0
  );

  const fineCollected = rows.reduce(
    (sum, row) => sum + Number(row.fine_amount || 0),
    0
  );

  const studentNotPaid = rows.filter(
    (row) => row.payment_status !== 'Completed'
  ).length;

  const totalOutstanding = rows.reduce(
    (sum, row) =>
      row.payment_status !== 'Completed'
        ? sum + Number(row.total_amount || 0)
        : sum,
    0
  );

  return {
  totalFeesCollected,
  fineCollected,
  studentNotPaid,
  totalOutstanding,

  totalFeesCollectedPercent:
    totalFeesCollected > 0 ? 100 : 0,

  fineCollectedPercent:
    fineCollected > 0 ? 100 : 0,

  studentNotPaidPercent:
    studentNotPaid > 0 ? 100 : 0,

  totalOutstandingPercent:
    totalOutstanding > 0 ? 100 : 0,
};
};

export default {
  getFeeSummary,
};