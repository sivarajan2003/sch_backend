// parent.routes.js
import express from 'express';
import controller from '../controller/parent.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/parent.dto.js';

const router = express.Router();

// Create Parent
router.post(
  '/',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createParentSchema),
  controller.createParent
);

// Get Parents with pagination + filters
router.get(
  '/',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.filterParentSchema, 'query'),
  controller.getParents
);

// Get Parent by ID
router.get(
  '/:id',
  verifyToken(['Super Admin', 'Admin']),
  controller.getParentById
);

// Update Parent (full update)
router.put(
  '/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateParentSchema),
  controller.updateParent
);

// Soft Delete Parent
router.delete(
  '/:id',
  verifyToken(['Super Admin']),
  controller.deleteParent
);

// Restore Parent
router.patch(
  '/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreParent
);

export default router;
