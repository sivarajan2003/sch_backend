import express from 'express';

import controller from '../controller/complaintsmaintenance.controller.js';

import dto from '../dto/complaintsmaintenance.dto.js';

import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.post(
  '/',
  validate(dto.createComplaintSchema),
  controller.createComplaint
);

router.get(
  '/',
  controller.getComplaints
);

router.get(
  '/:id',
  controller.getComplaintById
);

router.put(
  '/:id',
  validate(dto.updateComplaintSchema),
  controller.updateComplaint
);

router.delete(
  '/:id',
  controller.deleteComplaint
);

export default router;