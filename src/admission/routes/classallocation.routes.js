import express from 'express';
import controller from '../controller/classallocation.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/classallocation.dto.js';

const router = express.Router();

/* ============================
   CREATE CLASS ALLOCATION
============================ */

router.post(
  '/class-allocations',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  validate(dto.createClassAllocationSchema),
  controller.createClassAllocation
);

/* ============================
   REALLOCATE CLASS
============================ */

router.patch(
  '/class-allocations/reallocate',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.reallocateClassSchema),
  controller.reallocateClass
);

/* ============================
   DEACTIVATE CLASS ALLOCATION
============================ */

router.patch(
  '/class-allocations/:id/deactivate',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.deactivateClassAllocationSchema),
  controller.deactivateClassAllocation
);

/* ============================
   GET ALLOCATION BY ADMISSION
============================ */

router.get(
  '/class-allocations/admission/:admission_id',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  controller.getAllocationByAdmission
);

/* ============================
   LIST CLASS ALLOCATIONS
============================ */

router.get(
  '/class-allocations',
  verifyToken(['Super Admin', 'Admin', 'Receptionist']),
  validate(dto.filterClassAllocationSchema, 'query'),
  controller.getClassAllocations
);

export default router;
