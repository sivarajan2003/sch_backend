//routes/index.js
import express from 'express';
import admissionRoutes from './admission.routes.js';
import interviewRoutes from './interview.routes.js';
import feepaymentRoutes from './feepayment.routes.js';
import classAllocationRoutes from './classallocation.routes.js';
import dashboardRoutes from './admissiondashboard.routes.js';
import offerLetterRoutes from './offerletter.routes.js';

const router = express.Router();

router.use('/admission', admissionRoutes);
router.use('/admission', interviewRoutes);
router.use('/admission', feepaymentRoutes);
router.use('/admission', classAllocationRoutes);
router.use('/admission', dashboardRoutes);
router.use('/admission', offerLetterRoutes);

export default router;
