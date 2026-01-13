// academicyear.dto.js
import { z } from 'zod';

/**
 * Academicyear DTO validation schemas (Zod)
 * Matches academicyear.models.js fields.
 *
 * Required for create:
 * - yearsbyname, startdate, enddate
 *
 * Update schema allows partial updates.
 *
 * Includes a refinement to ensure enddate >= startdate when both provided.
 */

const dateCoerce = (msg) => z.coerce.date({ invalid_type_error: msg });

export const createAcademicyearSchema = z
  .object({
    yearsbyname: z.string().min(1, 'Year name is required').max(100),
    startdate: dateCoerce('Invalid startdate'),
    enddate: dateCoerce('Invalid enddate'),
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
  })
  .refine((data) => {
    // ensure enddate is same or after startdate
    try {
      const s = new Date(data.startdate);
      const e = new Date(data.enddate);
      return !isNaN(s) && !isNaN(e) && e.getTime() >= s.getTime();
    } catch {
      return false;
    }
  }, {
    message: 'enddate must be the same as or after startdate',
    path: ['enddate'],
  });

export const updateAcademicyearSchema = z
  .object({
    yearsbyname: z.string().min(1).max(100).optional(),
    startdate: dateCoerce('Invalid startdate').optional(),
    enddate: dateCoerce('Invalid enddate').optional(),
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
  })
  .refine((data) => {
    // if both dates provided, validate ordering
    if (data.startdate && data.enddate) {
      try {
        const s = new Date(data.startdate);
        const e = new Date(data.enddate);
        return !isNaN(s) && !isNaN(e) && e.getTime() >= s.getTime();
      } catch {
        return false;
      }
    }
    return true;
  }, {
    message: 'enddate must be the same as or after startdate',
    path: ['enddate'],
  });

export const filterAcademicyearSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(500).default(10),
  search: z.string().optional(),

  // date filters operate on startdate or enddate depending on your query design
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  is_active: z.preprocess(
    (v) => (v === 'true' || v === '1' || v === true ? true : v === 'false' || v === '0' ? false : undefined),
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
  createAcademicyearSchema,
  updateAcademicyearSchema,
  filterAcademicyearSchema,
};
