import express from 'express';
import hostelRoutes from './hostelsetup.routes.js';
import roommanagementRoutes from './roommanagement.routes.js';
import studentallocationRoutes from './studentallocation.routes.js';
import attendanceEntryRoutes from './attendanceentry.routes.js';
import complaintsmaintenanceRoutes from './complaintsmaintenance.routes.js';
import hostelfeemanagementRoutes from './hostelfeemanagement.routes.js';

const router = express.Router();

router.use('/', hostelRoutes);
router.use('/', roommanagementRoutes);
router.use('/', studentallocationRoutes);
router.use('/', attendanceEntryRoutes);

router.use(
  '/',
  complaintsmaintenanceRoutes
);

router.use(
  '/',
  hostelfeemanagementRoutes
);

export default router;