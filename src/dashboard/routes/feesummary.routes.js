//feesummary.routes.js
import express from 'express';
import controller from '../controller/feesummary.controller.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

router.get(
  '/fee-summary',
  verifyToken(['Super Admin', 'Admin']),
  controller.getFeeSummary
);

export default router;