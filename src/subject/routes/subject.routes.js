// subject.routes.js
import express from 'express';
import controller from '../controller/subject.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/subject.dto.js';

const router = express.Router();

// Create Subject
router.post(
  '/subject',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createSubjectSchema),
  controller.createSubject
);

// Get Subjects with pagination + filters
router.get(
  '/subject',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.filterSubjectSchema, 'query'),
  controller.getSubjects
);

// Get Subject by ID
router.get(
  '/subject/:id',
  verifyToken(['Super Admin', 'Admin']),
  controller.getSubjectById
);

// Update Subject (full update)
router.put(
  '/subject/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateSubjectSchema),
  controller.updateSubject
);

// Partial update (PATCH)
router.patch(
  '/subject/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateSubjectSchema),
  controller.patchSubject
);

// Soft Delete Subject
router.delete(
  '/subject/:id',
  verifyToken(['Super Admin']),
  controller.deleteSubject
);

// Restore Subject
router.patch(
  '/subject/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreSubject
);

export default router;
