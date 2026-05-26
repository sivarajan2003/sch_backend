import express from 'express';
import controller from '../controller/attendance.controller.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

// Generic attendance (all types)
router.post('/', verifyToken(['Super Admin', 'Admin']), controller.createAttendance);
router.get('/', verifyToken(['Super Admin', 'Admin']), controller.getAttendance);

// Teacher attendance — bulk save for a date
router.post('/teacher/save', verifyToken(['Super Admin', 'Admin']), controller.saveTeacherAttendance);

// Teacher attendance — get by specific date (returns map)
router.get('/teacher', verifyToken(['Super Admin', 'Admin']), controller.getTeacherAttendanceByDate);

// Teacher attendance — date range report
router.get('/teacher/range', verifyToken(['Super Admin', 'Admin']), controller.getTeacherAttendanceRange);

export default router;
