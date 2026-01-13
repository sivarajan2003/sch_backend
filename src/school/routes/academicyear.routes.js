// academicyear.routes.js
import express from 'express';
import controller from '../controller/academicyear.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/academicyear.dto.js';

const router = express.Router();

router.post(
  '/academicyear',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createAcademicyearSchema),
  controller.createAcademicyear
);

router.get(
  '/academicyear',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.filterAcademicyearSchema, 'query'),
  controller.getAcademicyears
);

router.get(
  '/academicyear/:id',
  verifyToken(['Super Admin', 'Admin']),
  controller.getAcademicyearById
);

router.put(
  '/academicyear/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateAcademicyearSchema),
  controller.updateAcademicyear
);

router.patch(
  '/academicyear/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateAcademicyearSchema),
  controller.patchAcademicyear
);

// Soft Delete Academicyear
router.delete(
  '/academicyear/:id',
  verifyToken(['Super Admin']),
  controller.deleteAcademicyear
);

// Restore Academicyear
router.patch(
  '/academicyear/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreAcademicyear
);

export default router;
