import { z } from 'zod';

/**
 * Admission DTO validation schemas (Zod)
 * MUST match Sequelize Admission model exactly
 */

/* ============================
   ENUM DEFINITIONS
============================ */

const PAYMENT_METHOD_ENUM = ['CARD', 'UPI', 'NET_BANKING', 'CASH'];


// Gender
const GENDER_ENUM = ['Male', 'Female', 'Other'];

// Quota category
const QUOTA_ENUM = ['General', 'management', 'sports', 'minority'];

// Admission workflow status (FULL LIST)
const ADMISSION_STATUS_ENUM = [
  'Applied',
  'Pending',
  'Approved',
  'Rejected',
  'Verifying Documents',
  'Interview Scheduled',
  'Interview Done',
  'Offer Sent',
  'Offer Accepted',
  'Enrolled',
];

// Document verification status
const DOCUMENT_STATUS_ENUM = [
  'Pending',
  'Verified',
  'Rejected',
  'want to reupload',
  'not uploaded',
];

// Payment status
const PAYMENT_STATUS_ENUM = ['Pending', 'Completed', 'Failed'];

/* ============================
   COMMON VALIDATIONS
============================ */

// Phone validation
const phoneRegex = /^[+\d]?(?:[\d -]{7,14})$/;

/* ============================
   CREATE ADMISSION
============================ */

export const createAdmissionSchema = z.object({
  /* ============================
     STUDENT DETAILS
  ============================ */

  student_name: z.string().min(1).max(100),
  date_of_birth: z.coerce.date(),
  gender: z.enum(GENDER_ENUM),

  address: z.string().min(1),

  addmission_number: z.string().min(1).max(50),
  class_applied_id: z.string().uuid(),

  /* ============================
     PARENT DETAILS
  ============================ */

  parent_name: z.string().min(1).max(100),
  parent_number: z
    .string()
    .min(7)
    .max(15)
    .regex(phoneRegex),
  parent_email: z.string().email().max(100),

  /* ============================
     ADMISSION INFO
  ============================ */

  quota_category: z.enum(QUOTA_ENUM),

  academic_achievements: z.string().optional().nullable(),
  previous_school: z.string().optional().nullable(),
  last_year_grade: z.string().optional().nullable(),
  year_of_passing: z.coerce.number().int().optional().nullable(),
  reason_for_transfer: z.string().optional().nullable(),

  /* ============================
     DOCUMENT PATHS
  ============================ */

  birth_certificate: z.string().optional().nullable(),
  tc_certificate: z.string().optional().nullable(),
  passport_size_photo: z.string().optional().nullable(),
  address_proof: z.string().optional().nullable(),

  /* ============================
     ADMISSION WORKFLOW
  ============================ */

  admission_status: z.enum(ADMISSION_STATUS_ENUM).default('Pending'),
  is_active: z.boolean().default(true),

  /* ============================
     💰 FEE PAYMENT (NEW & REQUIRED)
  ============================ */

  registration_fee: z.coerce.number().min(0),
  total_amount: z.coerce.number().min(1),
  payment_method: z.enum(PAYMENT_METHOD_ENUM),
  payment_date: z.coerce.date(),

  payment_status: z.enum(PAYMENT_STATUS_ENUM).default('Completed'),
  receipt_no: z.string().optional().nullable(),
  fee_remark: z.string().optional().nullable(),

  /* ============================
     META
  ============================ */

  created_by: z.string().uuid().optional().nullable(),
  created_by_name: z.string().optional().nullable(),
  created_by_email: z.string().email().optional().nullable(),
});


/* ============================
   UPDATE ADMISSION
============================ */

export const updateAdmissionSchema = z.object({
  // Student details
  student_name: z.string().min(1).max(100).optional(),
  date_of_birth: z.coerce.date().optional(),
  gender: z.enum(GENDER_ENUM).optional(),

  address: z.string().optional(),

  // Admission identifiers
  addmission_number: z.string().max(50).optional(),
  class_applied_id: z.string().uuid().optional(),

  // Parent details
  parent_name: z.string().max(100).optional(),
  parent_number: z
    .string()
    .min(7)
    .max(15)
    .regex(phoneRegex)
    .optional(),
  parent_email: z.string().email().max(100).optional(),

  // Admission info
  quota_category: z.enum(QUOTA_ENUM).optional(),
  payment_status: z.enum(PAYMENT_STATUS_ENUM).optional(),

  academic_achievements: z.string().optional().nullable(),
  previous_school: z.string().max(150).optional().nullable(),
  last_year_grade: z.string().max(50).optional().nullable(),
  year_of_passing: z.coerce
    .number()
    .int()
    .min(1900)
    .max(2100)
    .optional()
    .nullable(),

  reason_for_transfer: z.string().optional().nullable(),

  // Document files
  birth_certificate: z.string().optional().nullable(),
  tc_certificate: z.string().optional().nullable(),
  passport_size_photo: z.string().optional().nullable(),
  address_proof: z.string().optional().nullable(),

  // Document verification
  birth_certificate_status: z.enum(DOCUMENT_STATUS_ENUM).optional(),
  birth_certificate_remarks: z.string().optional().nullable(),

  tc_certificate_status: z.enum(DOCUMENT_STATUS_ENUM).optional(),
  tc_certificate_remarks: z.string().optional().nullable(),

  passport_size_photo_status: z.enum(DOCUMENT_STATUS_ENUM).optional(),
  passport_size_photo_remarks: z.string().optional().nullable(),

  address_proof_status: z.enum(DOCUMENT_STATUS_ENUM).optional(),
  address_proof_remarks: z.string().optional().nullable(),

  // Workflow
  admission_status: z.enum(ADMISSION_STATUS_ENUM).optional(),

  // Meta
  is_active: z.boolean().optional(),
  updated_by: z.string().uuid().optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),
});

/* ============================
   DOCUMENT VERIFICATION ONLY
   (Recommended separate API)
============================ */

export const verifyDocumentsSchema = z.object({
  birth_certificate_status: z.enum(DOCUMENT_STATUS_ENUM).optional(),
  birth_certificate_remarks: z.string().optional().nullable(),

  tc_certificate_status: z.enum(DOCUMENT_STATUS_ENUM).optional(),
  tc_certificate_remarks: z.string().optional().nullable(),

  passport_size_photo_status: z.enum(DOCUMENT_STATUS_ENUM).optional(),
  passport_size_photo_remarks: z.string().optional().nullable(),

  address_proof_status: z.enum(DOCUMENT_STATUS_ENUM).optional(),
  address_proof_remarks: z.string().optional().nullable(),
});

/* ============================
   FILTER / LIST ADMISSIONS
============================ */

export const filterAdmissionSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().optional(),

  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  includeAudit: z.preprocess(
    (v) => v === 'true' || v === '1' || v === true,
    z.boolean().optional()
  ),

  includeDeleted: z.preprocess(
    (v) => v === 'true' || v === '1' || v === true,
    z.boolean().optional()
  ),

  filters: z.union([z.string(), z.record(z.any())]).optional(),
  order: z.union([z.string(), z.array(z.array(z.string()))]).optional(),
});

/* ============================
   EXPORTS
============================ */

export default {
  createAdmissionSchema,
  updateAdmissionSchema,
  verifyDocumentsSchema,
  filterAdmissionSchema,
};
