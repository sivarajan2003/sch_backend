import express from 'express';
import controller from '../controller/interview.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/interview.dto.js';

const router = express.Router();


// ------------------------
// CREATE INTERVIEW
// ------------------------

router.post(
  '/interviews',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createInterviewSchema),
  controller.createInterview
);


// ------------------------
// GET INTERVIEWS (LIST + FILTER)
// ------------------------

router.get(
  '/interviews',
  verifyToken(['Super Admin', 'Admin', 'Teacher','Parent']),
  validate(dto.filterInterviewSchema, 'query'),
  controller.getInterviews
);


// ------------------------
// GET INTERVIEW BY ID
// ------------------------

router.get(
  '/interviews/:id',
  verifyToken(['Super Admin', 'Admin', 'Teacher','Parent']),
  controller.getInterviewById
);


// ------------------------
// UPDATE INTERVIEW (FULL UPDATE)
// ------------------------

router.put(
  '/interviews/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateInterviewSchema),
  controller.updateInterview
);


// ------------------------
// DOCUMENT VERIFICATION
// ------------------------

router.patch(
  '/interviews/:id/documents',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.documentVerificationSchema),
  controller.verifyDocuments
);


// ------------------------
// UPDATE INTERVIEW STATUS
// ------------------------

router.patch(
  '/interviews/:id/status',
  verifyToken(['Super Admin', 'Admin', 'Teacher']),
  validate(dto.interviewStatusUpdateSchema),
  controller.updateInterviewStatus
);


// ------------------------
// SOFT DELETE INTERVIEW
// ------------------------

router.delete(
  '/interviews/:id',
  verifyToken(['Super Admin']),
  controller.deleteInterview
);


// ------------------------
// RESTORE INTERVIEW
// ------------------------

router.patch(
  '/interviews/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreInterview
);


export default router;
