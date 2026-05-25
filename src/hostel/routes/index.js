import express from 'express';
import hostelRoutes from './hostelsetup.routes.js';
import roommanagementRoutes from './roommanagement.routes.js';
import studentallocationRoutes from './studentallocation.routes.js';
import attendanceEntryRoutes
from './attendanceentry.routes.js';
const router = express.Router();

router.use('/hostel', hostelRoutes);
router.use('/hostel', roommanagementRoutes);
router.use('/hostel', studentallocationRoutes);
router.use('/hostel', attendanceEntryRoutes);
export default router;