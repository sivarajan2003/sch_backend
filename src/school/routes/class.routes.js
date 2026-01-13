// class.routes.js
import express from 'express';
import controller from '../controller/class.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/class.dto.js';

const router = express.Router();

// Create Class
router.post(
  '/class',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createClassSchema),
  controller.createClass
);

// Get Classes with pagination + filters
router.get(
  '/class',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.filterClassSchema, 'query'),
  controller.getClasses
);

// Get Class by ID
router.get(
  '/class/:id',
  verifyToken(['Super Admin', 'Admin']),
  controller.getClassById
);

// Update Class (full update)
router.put(
  '/class/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateClassSchema),
  controller.updateClass
);

// Partial update (PATCH)
router.patch(
  '/class/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateClassSchema),
  controller.patchClass
);

// Soft Delete Class
router.delete(
  '/class/:id',
  verifyToken(['Super Admin']),
  controller.deleteClass
);

// Restore Class
router.patch(
  '/class/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreClass
);

export default router;
