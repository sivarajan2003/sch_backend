import express from 'express';

import controller from '../controller/studentallocation.controller.js';

import dto from '../dto/studentallocation.dto.js';

import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.post(
  '/studentallocation',
  validate(dto.createAllocationSchema),
  controller.createAllocation
);

router.get(
  '/studentallocation',
  controller.getAllocations
);

router.put(
  '/studentallocation/:id',
  validate(dto.updateAllocationSchema),
  controller.updateAllocation
);

router.delete(
  '/studentallocation/:id',
  controller.deleteAllocation
);

export default router;