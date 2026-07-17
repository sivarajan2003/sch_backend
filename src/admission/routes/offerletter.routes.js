// offerletter.routes.js
import express from 'express';
import controller from '../controller/offerletter.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/offerletter.dto.js';

const router = express.Router();


// ------------------------
// TEMPLATE
// ------------------------

router.get(
  '/offer-letters/template',
  verifyToken(['Super Admin', 'Admin', 'Parent']),
  controller.getTemplate
);

router.post(
  '/offer-letters/template',
  verifyToken(['Super Admin', 'Admin']),
  controller.saveTemplate
);


// ------------------------
// CREATE OFFER LETTER
// ------------------------

router.post(
  '/offer-letters',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createOfferLetterSchema),
  controller.createOfferLetter
);


// ------------------------
// GET OFFER LETTERS (LIST)
// ------------------------

router.get(
  '/offer-letters',
  verifyToken(['Super Admin', 'Admin', 'Parent']),
  validate(dto.filterOfferLetterSchema, 'query'),
  controller.getOfferLetters
);


// ------------------------
// GET OFFER LETTER BY ID
// ------------------------

router.get(
  '/offer-letters/:id',
  verifyToken(['Super Admin', 'Admin', 'Parent']),
  controller.getOfferLetterById
);


// ------------------------
// UPDATE OFFER LETTER (FULL)
// ------------------------

router.put(
  '/offer-letters/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateOfferLetterSchema),
  controller.updateOfferLetter
);


// ------------------------
// UPDATE STATUS
// ------------------------

router.patch(
  '/offer-letters/:id/status',
  verifyToken(['Super Admin', 'Admin', 'Parent']),
  validate(dto.updateStatusSchema),
  controller.updateOfferLetterStatus
);


// ------------------------
// UPDATE PAYMENT STATUS
// ------------------------

router.patch(
  '/offer-letters/:id/payment-status',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updatePaymentStatusSchema),
  controller.updatePaymentStatus
);


// ------------------------
// SOFT DELETE
// ------------------------

router.delete(
  '/offer-letters/:id',
  verifyToken(['Super Admin']),
  controller.deleteOfferLetter
);


// ------------------------
// RESTORE
// ------------------------

router.patch(
  '/offer-letters/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreOfferLetter
);


export default router;
