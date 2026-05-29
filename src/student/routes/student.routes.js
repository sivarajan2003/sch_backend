// student.routes.js
import express from 'express';
import controller from '../controller/student.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/student.dto.js';

const router = express.Router();

// Create Student
router.post(
  '/',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createStudentSchema),
  controller.createStudent
);

// Get Students with pagination + filters
router.get(
  '/',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.filterStudentSchema, 'query'),
  controller.getStudents
);

// Get Student by ID
router.get(
  '/:id',
  verifyToken(['Super Admin', 'Admin']),
  controller.getStudentById
);

// Update Student (full update)
router.put(
  '/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateStudentSchema),
  controller.updateStudent
);

// Partial update (PATCH)
router.patch(
  '/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateStudentSchema),
  controller.patchStudent
);

// Soft Delete Student
router.delete(
  '/:id',
  verifyToken(['Super Admin']),
  controller.deleteStudent
);

// Restore Student
router.patch(
  '/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreStudent
);

export default router;
