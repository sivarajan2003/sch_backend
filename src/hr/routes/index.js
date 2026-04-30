import express from 'express';
import hrRoutes from './hr.routes.js';
import payrollRoutes from "./payroll.routes.js";

const router = express.Router();

// HR routes
router.use('/hr', hrRoutes);

// ✅ Payroll routes under /hr/payroll
router.use('/hr/payroll', payrollRoutes);

export default router;