//feepayment.route.js
import express from 'express';
import controller from '../controller/feepayment.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/feepayment.dto.js';

const router = express.Router();

router.post(
  '/feepayment',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createFeePaymentSchema),
  controller.createFeePayment
);

router.get(
  '/feepayment',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.filterFeePaymentSchema, 'query'),
  controller.getFeePayments
);

router.get(
  '/feepayment/:id',
  verifyToken(['Super Admin', 'Admin']),
  controller.getFeePaymentById
);

router.put(
  '/feepayment/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateFeePaymentSchema),
  controller.updateFeePayment
);

router.delete(
  '/feepayment/:id',
  verifyToken(['Super Admin']),
  controller.deleteFeePayment
);

export default router;
