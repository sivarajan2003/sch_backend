// offerletter.dto.js
import { z } from 'zod';

const STATUS_ENUM = ['Generated', 'Accepted', 'Declined'];
const PAYMENT_STATUS_ENUM = ['Pending', 'Completed', 'Failed'];

/**
 * CREATE OFFER LETTER
 */
export const createOfferLetterSchema = z.object({
  admission_id: z.string().uuid('Invalid admission_id'),

  letter_date: z.coerce.date({ invalid_type_error: 'Invalid letter_date' }),

  validity_date: z.coerce.date({ invalid_type_error: 'Invalid validity_date' }),

  status: z.enum(STATUS_ENUM).optional(),

  payment_status: z.enum(PAYMENT_STATUS_ENUM).optional(),

  remarks: z.string().optional().nullable(),

  is_active: z.boolean().optional(),

  created_by: z.string().uuid().optional().nullable(),
  created_by_name: z.string().optional().nullable(),
  created_by_email: z.string().email().optional().nullable(),
});


/**
 * UPDATE OFFER LETTER
 */
export const updateOfferLetterSchema = z.object({
  letter_date: z.coerce.date().optional(),

  validity_date: z.coerce.date().optional(),

  status: z.enum(STATUS_ENUM).optional(),

  payment_status: z.enum(PAYMENT_STATUS_ENUM).optional(),

  remarks: z.string().optional().nullable(),

  is_active: z.boolean().optional(),

  updated_by: z.string().uuid().optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),
});


/**
 * UPDATE STATUS
 */
export const updateStatusSchema = z.object({
  status: z.enum(STATUS_ENUM),

  updated_by: z.string().uuid().optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),
});


/**
 * UPDATE PAYMENT STATUS
 */
export const updatePaymentStatusSchema = z.object({
  payment_status: z.enum(PAYMENT_STATUS_ENUM),

  updated_by: z.string().uuid().optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),
});


/**
 * FILTER / LIST
 */
export const filterOfferLetterSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().optional(),

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

  order: z.union([z.string(), z.array(z.array(z.string()))]).optional(),
});


export default {
  createOfferLetterSchema,
  updateOfferLetterSchema,
  updateStatusSchema,
  updatePaymentStatusSchema,
  filterOfferLetterSchema,
};
