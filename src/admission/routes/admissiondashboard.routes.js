import express from 'express';
import controller from '../controller/admissiondashboard.controller.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

/* ============================
   ADMISSION DASHBOARD
============================ */

/**
 * DASHBOARD SUMMARY STATS
 * GET /admission/dashboard/stats
 */
router.get(
  '/dashboard/stats',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  controller.getDashboardStats
);

/**
 * ADMISSION FUNNEL
 * GET /admission/dashboard/funnel
 */
router.get(
  '/dashboard/funnel',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  controller.getAdmissionFunnel
);

/**
 * CLASS CAPACITY
 * GET /admission/dashboard/class-capacity
 */
router.get(
  '/dashboard/class-capacity',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  controller.getClassCapacity
);

/**
 * RECENT APPLICATIONS
 * GET /admission/dashboard/recent-applications
 */
router.get(
  '/dashboard/recent-applications',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  controller.getRecentApplications
);

export default router;
