// class.dto.js
import { z } from 'zod';

/**
 * Class DTO validation schemas (Zod)
 * Matches class.models.js fields.
 *
 * Required for create:
 * - name, section, grade, capacity
 *
 * Update schema allows partial updates.
 */

const NAME_MAX = 100;
const SECTION_MAX = 10;

export const createClassSchema = z.object({
  name: z.string().min(1, 'Name is required').max(NAME_MAX),
  section: z.string().min(1, 'Section is required').max(SECTION_MAX),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
  is_active: z.boolean().optional(),

  // audit/meta (optional)
  created_by: z.string().uuid().optional().nullable(),
  updated_by: z.string().uuid().optional().nullable(),
  deleted_by: z.string().uuid().optional().nullable(),

  created_by_name: z.string().optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  deleted_by_name: z.string().optional().nullable(),

  created_by_email: z.string().email().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),
  deleted_by_email: z.string().email().optional().nullable(),
});

export const updateClassSchema = z.object({
  name: z.string().min(1).max(NAME_MAX).optional(),
  section: z.string().min(1).max(SECTION_MAX).optional(),
  capacity: z.coerce.number().int().min(1).optional(),
  is_active: z.boolean().optional(),

  // audit/meta
  created_by: z.string().uuid().optional().nullable(),
  updated_by: z.string().uuid().optional().nullable(),
  deleted_by: z.string().uuid().optional().nullable(),

  created_by_name: z.string().optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  deleted_by_name: z.string().optional().nullable(),

  created_by_email: z.string().email().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),
  deleted_by_email: z.string().email().optional().nullable(),
});

export const filterClassSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(500).default(10),
  search: z.string().optional(),
  section: z.string().optional(),
  is_active: z.preprocess(
    (v) => (v === 'true' || v === '1' || v === true ? true : v === 'false' || v === '0' ? false : undefined),
    z.boolean().optional()
  ),

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

  // whether to include students when returning classes
  includeStudents: z.preprocess(
    (v) => (v === 'true' || v === '1' || v === true ? true : false),
    z.boolean().optional()
  ),

  // generic filters and ordering
  filters: z.union([z.string(), z.record(z.any())]).optional(),
  order: z.union([z.string(), z.array(z.array(z.string()))]).optional(),
});

export default {
  createClassSchema,
  updateClassSchema,
  filterClassSchema,
};
