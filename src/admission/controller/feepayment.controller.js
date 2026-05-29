//feepayment.controller.js
import feePaymentService from '../service/feepayment.service.js';

const createFeePayment = async (req, res) => {
  try {
    const data = await feePaymentService.createFeePayment(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFeePayments = async (req, res) => {
  try {
    const data = await feePaymentService.getFeePayments(req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFeePaymentById = async (req, res) => {
  try {
    const data = await feePaymentService.getFeePaymentById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const updateFeePayment = async (req, res) => {
  try {
    const data = await feePaymentService.updateFeePayment(
      req.params.id,
      req.body
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteFeePayment = async (req, res) => {
  try {
    await feePaymentService.deleteFeePayment(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export default {
  createFeePayment,
  getFeePayments,
  getFeePaymentById,
  updateFeePayment,
  deleteFeePayment,
};
