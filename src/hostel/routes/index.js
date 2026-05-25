import express from 'express';
import hostelRoutes from './hostelsetup.routes.js';
import roommanagementRoutes from './roommanagement.routes.js';
import studentallocationRoutes from './studentallocation.routes.js';
import attendanceEntryRoutes
from './attendanceentry.routes.js';
import complaintsmaintenanceRoutes from './complaintsmaintenance.routes.js';
import hostelfeemanagementRoutes
from './hostelfeemanagement.routes.js';

const router = express.Router();

router.use('/hostel', hostelRoutes);
router.use('/hostel', roommanagementRoutes);
router.use('/hostel', studentallocationRoutes);
router.use('/hostel', attendanceEntryRoutes);
router.use(
  '/complaintsmaintenance',
  complaintsmaintenanceRoutes
);
router.use(
  '/hostelfeemanagement',
  hostelfeemanagementRoutes
);
export default router;