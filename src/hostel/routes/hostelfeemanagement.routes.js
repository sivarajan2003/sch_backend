import express from 'express';

import controller from '../controller/hostelfeemanagement.controller.js';

const router = express.Router();

router.post(
  '/',
  controller.createFee
);

router.get(
  '/',
  controller.getFees
);

router.put(
  '/:id',
  controller.updateFee
);

router.delete(
  '/:id',
  controller.deleteFee
);

export default router;