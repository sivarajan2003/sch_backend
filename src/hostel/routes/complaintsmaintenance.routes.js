import express from 'express';

import controller from '../controller/complaintsmaintenance.controller.js';

import dto from '../dto/complaintsmaintenance.dto.js';

import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.post(
  '/complaintsmaintenance',
  validate(dto.createComplaintSchema),
  controller.createComplaint
);

router.get(
  '/complaintsmaintenance',
  controller.getComplaints
);

router.get(
  '/complaintsmaintenance/:id',
  controller.getComplaintById
);

router.put(
  '/complaintsmaintenance/:id',
  validate(dto.updateComplaintSchema),
  controller.updateComplaint
);

router.delete(
  '/complaintsmaintenance/:id',
  controller.deleteComplaint
);
export default router;