//teacher.routes.js
import express from 'express';
import controller from '../controller/teacher.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/teacher.dto.js';

const router = express.Router();

// Create Teacher
router.post(
  '/',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createTeacherSchema),
  controller.createTeacher
);

// Get Teachers with pagination + filters
router.get(
  '/',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.filterTeacherSchema, 'query'),
  controller.getTeachers
);

// Get Teacher by ID
router.get(
  '/:id',
  verifyToken(['Super Admin', 'Admin']),
  controller.getTeacherById
);

// Update Teacher (full update)
router.put(
  '/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateTeacherSchema),
  controller.updateTeacher
);

// Soft Delete Teacher
router.delete(
  '/:id',
  verifyToken(['Super Admin']),
  controller.deleteTeacher
);

// Restore Teacher (PATCH to follow your requirement)
router.patch(
  '/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreTeacher
);

export default router;