// studentattendance.routes.js
import express from 'express';
import controller from '../controller/studentattendance.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/studentattendance.dto.js';

const router = express.Router();

// Create Attendance
router.post(
  '/studentattendance',
  verifyToken(['Super Admin', 'Admin', 'Teacher']),
  validate(dto.createAttendanceSchema),
  controller.createAttendance
);

router.post(
  '/studentattendance/bulk',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createAttendanceSchema.array()),
  controller.bulkCreateAttendance
);

// Get Attendance Records with pagination + filters
router.get(
  '/studentattendance',
  verifyToken(['Super Admin', 'Admin', 'Teacher']),
  validate(dto.filterAttendanceSchema, 'query'),
  controller.getAttendances
);

// Get Attendance by ID
router.get(
  '/studentattendance/:id',
  verifyToken(['Super Admin', 'Admin', 'Teacher']),
  controller.getAttendanceById
);

// Update Attendance (full update)
router.put(
  '/studentattendance/:id',
  verifyToken(['Super Admin', 'Admin', 'Teacher']),
  validate(dto.updateAttendanceSchema),
  controller.updateAttendance
);

// Partial Update Attendance (PATCH)
router.patch(
  '/studentattendance/:id',
  verifyToken(['Super Admin', 'Admin', 'Teacher']),
  validate(dto.updateAttendanceSchema),
  controller.patchAttendance
);

// Soft Delete Attendance
router.delete(
  '/studentattendance/:id',
  verifyToken(['Super Admin', 'Admin']),
  controller.deleteAttendance
);

// Restore Attendance
router.patch(
  '/studentattendance/:id/restore',
  verifyToken(['Super Admin', 'Admin']),
  controller.restoreAttendance
);

export default router;
