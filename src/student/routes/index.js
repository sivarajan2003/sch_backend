import express from 'express';
import studentRoutes from './student.routes.js';
import studentattendanceRoutes from './studentattendance.routes.js';

const router = express.Router();

router.use('/student', studentRoutes)
router.use('/student', studentattendanceRoutes);

export default router;