// classsubjectteacher.routes.js
import express from 'express';
import controller from '../controller/classsubjectteacher.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/classsubjectteacher.dto.js';

const router = express.Router();

// Create mapping
router.post(
  '/classsubjectteacher',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createClassSubjectTeacherSchema),
  controller.createClassSubjectTeacher
);

// List all mappings
router.get(
  '/classsubjectteacher',
  verifyToken(['Super Admin', 'Admin', 'Teacher']),
  validate(dto.filterClassSubjectTeacherSchema, 'query'),
  controller.getClassSubjectTeachers
);

// Get by id
router.get(
  '/classsubjectteacher/:id',
  verifyToken(['Super Admin', 'Admin', 'Teacher']),
  controller.getClassSubjectTeacherById
);

// Update fully
router.put(
  '/classsubjectteacher/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateClassSubjectTeacherSchema),
  controller.updateClassSubjectTeacher
);

// Patch update
router.patch(
  '/classsubjectteacher/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateClassSubjectTeacherSchema),
  controller.patchClassSubjectTeacher
);

// Soft delete
router.delete(
  '/classsubjectteacher/:id',
  verifyToken(['Super Admin']),
  controller.deleteClassSubjectTeacher
);

// Restore
router.patch(
  '/classsubjectteacher/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreClassSubjectTeacher
);

export default router;
