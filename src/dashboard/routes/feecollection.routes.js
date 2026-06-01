//feecollection.routes.js
import express from 'express';
import controller from '../controller/feecollection.controller.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

router.get(
  '/fee-collection',
  verifyToken(['Super Admin', 'Admin']),
  controller.getFeeCollection
);

export default router;