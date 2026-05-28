//hostelfeemanagement.routes.js
import express from 'express';

import controller from '../controller/hostelfeemanagement.controller.js';

const router = express.Router();

router.post(
  '/hostelfeemanagement',
  controller.createFee
);

router.get(
  '/hostelfeemanagement',
  controller.getFees
);

router.get(
  '/hostelfeemanagement/:id',
  controller.getFeeById
);

router.put(
  '/hostelfeemanagement/:id',
  controller.updateFee
);

router.delete(
  '/hostelfeemanagement/:id',
  controller.deleteFee
);

export default router;