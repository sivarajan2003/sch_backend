// settings.routes.js
import express from 'express';
import controller from '../controller/settings.controller.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

// GET all settings (optionally filter by ?category=academic)
router.get(
  '/',
  verifyToken(['Super Admin', 'Admin']),
  controller.getSettings
);

// PUT bulk update
router.put(
  '/',
  verifyToken(['Super Admin', 'Admin']),
  controller.updateSettings
);

// PUT single setting by key
router.put(
  '/:key',
  verifyToken(['Super Admin', 'Admin']),
  controller.setSetting
);

export default router;
