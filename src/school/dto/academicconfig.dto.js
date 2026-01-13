// academicconfig.dto.js
import { z } from 'zod';

/**
 * AcademicyearConfig DTO validation schemas (Zod)
 * Matches academicconfig.models.js fields.
 *
 * Required for create:
 * - academicyear_id (UUID)
 * - class_id (UUID)
 * - fees (number >= 0)
 * - nameofconfig (string)
 *
 * class_teacher_id is optional (can be assigned later)
 */

const uuidOrNull = (msg = 'Invalid UUID') => z.string().uuid({ message: msg }).optional().nullable();

export const createAcademicConfigSchema = z.object({
  academicyear_id: z.string().uuid({ message: 'academicyear_id must be a valid UUID' }),
  class_id: z.string().uuid({ message: 'class_id must be a valid UUID' }),

  // optional teacher assignment
  class_teacher_id: z.string().uuid({ message: 'class_teacher_id must be a valid UUID' }).optional().nullable(),

  // fees & name
  fees: z.coerce.number({ invalid_type_error: 'fees must be a number' }).nonnegative('fees must be >= 0'),
  nameofconfig: z.string().min(1, 'nameofconfig is required').max(100),

  is_active: z.boolean().optional(),

  // audit/meta (optional)
  created_by: uuidOrNull(),
  updated_by: uuidOrNull(),
  deleted_by: uuidOrNull(),

  created_by_name: z.string().optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  deleted_by_name: z.string().optional().nullable(),

  created_by_email: z.string().email().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),
  deleted_by_email: z.string().email().optional().nullable(),
});

export const updateAcademicConfigSchema = z.object({
  academicyear_id: z.string().uuid().optional(),
  class_id: z.string().uuid().optional(),

  class_teacher_id: z.string().uuid().optional().nullable(),

  fees: z.coerce.number({ invalid_type_error: 'fees must be a number' }).nonnegative('fees must be >= 0').optional(),
  nameofconfig: z.string().min(1).max(100).optional(),

  is_active: z.boolean().optional(),

  // audit/meta (optional)
  created_by: uuidOrNull(),
  updated_by: uuidOrNull(),
  deleted_by: uuidOrNull(),

  created_by_name: z.string().optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  deleted_by_name: z.string().optional().nullable(),

  created_by_email: z.string().email().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),
  deleted_by_email: z.string().email().optional().nullable(),
});

export const filterAcademicConfigSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(500).default(10),
  search: z.string().optional(),

  academicyear_id: z.string().uuid().optional(),
  class_id: z.string().uuid().optional(),
  class_teacher_id: z.string().uuid().optional(),

  is_active: z.preprocess(
    (v) => (v === 'true' || v === '1' || v === true ? true : v === 'false' || v === '0' ? false : undefined),
    z.boolean().optional()
  ),

  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  includeRelations: z.preprocess(
    (v) => (v === 'true' || v === '1' || v === true ? true : false),
    z.boolean().optional()
  ),
  includeAudit: z.preprocess(
    (v) => (v === 'true' || v === '1' || v === true ? true : false),
    z.boolean().optional()
  ),
  includeDeleted: z.preprocess(
    (v) => (v === 'true' || v === '1' || v === true ? true : false),
    z.boolean().optional()
  ),

  // generic filters and ordering
  filters: z.union([z.string(), z.record(z.any())]).optional(),
  order: z.union([z.string(), z.array(z.array(z.string()))]).optional(),
});

export default {
  createAcademicConfigSchema,
  updateAcademicConfigSchema,
  filterAcademicConfigSchema,
};
