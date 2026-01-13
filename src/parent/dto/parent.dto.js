// parent.dto.js
import { z } from 'zod';

/**
 * Parent DTO validation schemas (Zod)
 * Matches the Parent model fields:
 * - required for create: name, email, address
 * - optional for update
 */

const phoneRegex = /^[+\d]?(?:[\d -]{7,14})$/;

export const createParentSchema = z.object({
  // personal / contact
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email').max(60),
  phone: z.string().min(7).max(15).regex(phoneRegex, 'Invalid phone number').optional().nullable(),
  address: z.string().min(1, 'Address is required'),

  // optional link to admin user
  user_id: z.string().uuid().optional().nullable(),

  // other fields
  higher_education: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  childrens_count: z.coerce.number().int().nonnegative().optional().default(0),
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

export const updateParentSchema = z.object({
  // allow partial updates — all optional
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(60).optional(),
  phone: z.string().min(7).max(15).regex(phoneRegex, 'Invalid phone number').optional().nullable(),
  address: z.string().min(1).optional(),

  user_id: z.string().uuid().optional().nullable(),

  higher_education: z.string().optional().nullable(),
  childrens_count: z.coerce.number().int().nonnegative().optional(),
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

export const filterParentSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(200).default(10),
  search: z.string().optional(),

  // date filters for createdAt (or other date fields you might add)
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

  // generic filters can be provided as object or JSON string
  filters: z.union([z.string(), z.record(z.any())]).optional(),

  // order: string or array like [['createdAt','DESC']]
  order: z.union([z.string(), z.array(z.array(z.string()))]).optional(),
});

export default {
  createParentSchema,
  updateParentSchema,
  filterParentSchema,
};
