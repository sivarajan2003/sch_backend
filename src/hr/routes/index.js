// import express from 'express';
// import hrRoutes from './hr.routes.js';
// import payrollRoutes from "./payroll.routes.js";
// import teacherRoutes from "./teacher.routes.js";
// const router = express.Router();

// // HR routes
// router.use('/hr', hrRoutes);
// router.use("/teacher", teacherRoutes);                     
// // ✅ Payroll routes under /hr/payroll
// router.use('/hr/payroll', payrollRoutes);

// export default router;

import express from "express";
import hrRoutes from "./hr.routes.js";
import teacherRoutes from "./teacher.routes.js";

const router = express.Router();

router.use("/hr", hrRoutes);
router.use("/", teacherRoutes);

export default router;