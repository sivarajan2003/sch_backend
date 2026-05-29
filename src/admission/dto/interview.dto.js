// interview.dto.js
import { z } from 'zod';

/**
 * Interview DTO validation schemas (Zod)
 * Matches Interview Sequelize model exactly
 */

/**
 * ENUMS (must match Sequelize model)
 */
const INTERVIEW_STATUS_ENUM = ['Scheduled', 'Completed', 'Cancelled'];
const DOCUMENT_STATUS_ENUM = ['Pending', 'Verified', 'Rejected'];


/**
 * ------------------------
 * CREATE INTERVIEW
 * ------------------------
 */
export const createInterviewSchema = z.object({

  admission_id: z.string().uuid('Invalid admission_id'),

  interview_date: z.coerce.date({
    invalid_type_error: 'Invalid interview_date'
  }),

  teacher_id: z.string().uuid('Invalid teacher_id'),

  location: z.string()
    .min(1, 'Location is required')
    .max(150, 'Location too long'),

  status: z.enum(INTERVIEW_STATUS_ENUM).optional(),

  documents_status: z.enum(DOCUMENT_STATUS_ENUM).optional(),

  remarks: z.string().optional().nullable(),

  is_active: z.boolean().optional(),

  created_by: z.string().uuid().optional().nullable(),
  created_by_name: z.string().optional().nullable(),
  created_by_email: z.string().email().optional().nullable(),

});


/**
 * ------------------------
 * UPDATE INTERVIEW
 * ------------------------
 */
export const updateInterviewSchema = z.object({

  interview_date: z.coerce.date().optional(),

  teacher_id: z.string().uuid().optional(),

  location: z.string()
    .min(1)
    .max(150)
    .optional(),

  status: z.enum(INTERVIEW_STATUS_ENUM).optional(),

  documents_status: z.enum(DOCUMENT_STATUS_ENUM).optional(),

  remarks: z.string().optional().nullable(),

  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),

});


/**
 * ------------------------
 * DOCUMENT VERIFICATION
 * ------------------------
 */
export const documentVerificationSchema = z.object({

  documents_status: z.enum(DOCUMENT_STATUS_ENUM),

  remarks: z.string().optional().nullable(),

  updated_by: z.string().uuid().optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),

});


/**
 * ------------------------
 * UPDATE INTERVIEW STATUS
 * ------------------------
 */
export const interviewStatusUpdateSchema = z.object({

  status: z.enum(INTERVIEW_STATUS_ENUM),

  updated_by: z.string().uuid().optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),

});


/**
 * ------------------------
 * FILTER / LIST INTERVIEWS
 * ------------------------
 */
export const filterInterviewSchema = z.object({

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().optional(),

  // Interview date range
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  includeAudit: z.preprocess(
    (v) => (v === 'true' || v === '1' || v === true ? true : false),
    z.boolean().optional()
  ),

  includeDeleted: z.preprocess(
    (v) => (v === 'true' || v === '1' || v === true ? true : false),
    z.boolean().optional()
  ),

  filters: z.union([z.string(), z.record(z.any())]).optional(),

  order: z.union([
    z.string(),
    z.array(z.array(z.string()))
  ]).optional(),

});


export default {
  createInterviewSchema,
  updateInterviewSchema,
  documentVerificationSchema,
  interviewStatusUpdateSchema,
  filterInterviewSchema
};
