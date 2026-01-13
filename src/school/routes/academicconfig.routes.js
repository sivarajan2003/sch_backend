// academicconfig.routes.js
import express from 'express';
import controller from '../controller/academicconfig.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/academicconfig.dto.js';

const router = express.Router();

router.post(
  '/academicconfig',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createAcademicConfigSchema),
  controller.createAcademicConfig
);

router.get(
  '/academicconfig',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.filterAcademicConfigSchema, 'query'),
  controller.getAcademicConfigs
);

router.get(
  '/academicconfig/:id',
  verifyToken(['Super Admin', 'Admin']),
  controller.getAcademicConfigById
);

router.put(
  '/academicconfig/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateAcademicConfigSchema),
  controller.updateAcademicConfig
);

router.patch(
  '/academicconfig/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateAcademicConfigSchema),
  controller.patchAcademicConfig
);

router.delete(
  '/academicconfig/:id',
  verifyToken(['Super Admin']),
  controller.deleteAcademicConfig
);

router.patch(
  '/academicconfig/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreAcademicConfig
);

export default router;
