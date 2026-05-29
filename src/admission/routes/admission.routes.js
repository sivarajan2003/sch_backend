import express from 'express';
import controller from '../controller/admission.controller.js';
import offerLetterController from '../controller/offerletter.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/admission.dto.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

/* ============================
   FILE UPLOAD HANDLING
============================ */

const handleAdmissionUploads = upload.fields([
  { name: 'birthCert', maxCount: 1 },
  { name: 'leavingCert', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
]);

const transformFilesToBody = (req, res, next) => {
  if (req.files) {
    if (req.files.birthCert)
      req.body.birth_certificate = req.files.birthCert[0].location;

    if (req.files.leavingCert)
      req.body.tc_certificate = req.files.leavingCert[0].location;

    if (req.files.photo)
      req.body.passport_size_photo = req.files.photo[0].location;

    if (req.files.addressProof)
      req.body.address_proof = req.files.addressProof[0].location;
  }
  next();
};

/* ============================
   CREATE ADMISSION
============================ */

// Public admission (parents)
router.post(
  '/public-admissions',
  validate(dto.createAdmissionSchema),
  controller.createAdmission
);

// Staff/Admin admission
router.post(
  '/admissions',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  handleAdmissionUploads,
  transformFilesToBody,
  validate(dto.createAdmissionSchema),
  controller.createAdmission
);

/* ============================
   DOCUMENT VERIFICATION (NEW)
============================ */

router.patch(
  '/admissions/:id/documents',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  validate(dto.verifyDocumentsSchema),
  controller.verifyAdmissionDocuments
);

/* ============================
   STATS
============================ */

router.get(
  '/stats',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  controller.getStats
);

router.get(
  '/seat-allocation',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  controller.getSeatAllocationStats
);

/* ============================
   GET ADMISSIONS
============================ */

router.get(
  '/admissions',
  verifyToken(['Super Admin', 'Admin', 'Receptionist', 'Parent']),
  validate(dto.filterAdmissionSchema, 'query'),
  controller.getAdmissions
);

/* ============================
   GET ADMISSION BY ID
============================ */

router.get(
  '/admissions/:id',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  controller.getAdmissionById
);

/* ============================
   UPDATE ADMISSION
============================ */

router.put(
  '/admissions/:id',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  validate(dto.updateAdmissionSchema),
  controller.updateAdmission
);

/* ============================
   DELETE / RESTORE
============================ */

router.delete(
  '/admissions/:id',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  controller.deleteAdmission
);

router.patch(
  '/admissions/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreAdmission
);

/* ============================
   OFFER LETTER SETTINGS
============================ */
router.get(
  '/settings/offer-letter',
  verifyToken(['Super Admin', 'Admin', 'Receptionist', 'Parent']),
  offerLetterController.getTemplate
);

router.post(
  '/settings/offer-letter',
  verifyToken(['Super Admin', 'Admin']),
  offerLetterController.saveTemplate
);

export default router;
