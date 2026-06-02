//dashboard.routes.js
import express from 'express';
import controller from '../controller/dashboard.controller.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

router.get(
  '/stats',
  verifyToken(['Super Admin', 'Admin']),
  controller.getDashboardStats
);

export default router;