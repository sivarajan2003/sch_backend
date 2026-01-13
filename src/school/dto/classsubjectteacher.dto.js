// classsubjectteacher.dto.js
import { z } from 'zod';

/**
 * DTO validation for ClassSubjectTeacher mappings
 * - Required for create: class_id, subject_id, teacher_id, academicyear_id
 * - teacher_id may be optional depending on your workflow; here it's required for create but can be adjusted.
 */

const uuidOrNull = (msg = 'Invalid UUID') => z.string().uuid({ message: msg }).optional().nullable();

export const createClassSubjectTeacherSchema = z.object({
  class_id: z.string().uuid({ message: 'class_id must be a valid UUID' }),
  subject_id: z.string().uuid({ message: 'subject_id must be a valid UUID' }),
  teacher_id: z.string().uuid({ message: 'teacher_id must be a valid UUID' }).optional().nullable(),
  academicyear_id: z.string().uuid({ message: 'academicyear_id must be a valid UUID' }),

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

export const updateClassSubjectTeacherSchema = z.object({
  class_id: z.string().uuid().optional(),
  subject_id: z.string().uuid().optional(),
  teacher_id: z.string().uuid().optional().nullable(),
  academicyear_id: z.string().uuid().optional(),

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

export const filterClassSubjectTeacherSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(500).default(20),
  search: z.string().optional(),

  class_id: z.string().uuid().optional(),
  subject_id: z.string().uuid().optional(),
  teacher_id: z.string().uuid().optional(),
  academicyear_id: z.string().uuid().optional(),

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
  includeDeleted: z.preprocess(
    (v) => (v === 'true' || v === '1' || v === true ? true : false),
    z.boolean().optional()
  ),
  includeAudit: z.preprocess(
    (v) => (v === 'true' || v === '1' || v === true ? true : false),
    z.boolean().optional()
  ),

  // generic filters and ordering
  filters: z.union([z.string(), z.record(z.any())]).optional(),
  order: z.union([z.string(), z.array(z.array(z.string()))]).optional(),
});

export default {
  createClassSubjectTeacherSchema,
  updateClassSubjectTeacherSchema,
  filterClassSubjectTeacherSchema,
};
