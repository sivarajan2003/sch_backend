// teacher.dto.js
import { z } from 'zod';

/**
 * Full Teacher DTO validation schemas (Zod)
 * Matches the Teacher model fields:
 * - required for create: name, address, date_of_birth, gender, number, email, qualification
 * - optional for update
 */

const GENDER_ENUM = ['Male', 'Female', 'Other'];
const DESGINATION_ENUM = ['Head Master', 'Assistant Teacher', 'Teacher'];

// basic phone regex: digits, optional leading +, allow spaces/dashes
const phoneRegex = /^[+\d]?(?:[\d -]{7,14})$/;

export const createTeacherSchema = z.object({
  // personal
  name: z.string().min(1, 'Name is required').max(100),
  address: z.string().min(1, 'Address is required'),
  date_of_birth: z.coerce.date({ invalid_type_error: 'Invalid date_of_birth' }),
  gender: z.enum(GENDER_ENUM),

  // contact
  number: z.string().min(7).max(15).regex(phoneRegex, 'Invalid phone number'),
  email: z.string().email('Invalid email').max(60),

  // optional link to user account
  user_id: z.string().uuid().optional().nullable(),

  // professional
  qualification: z.string().min(1, 'Qualification is required'),
  hire_date: z.coerce.date().optional(),
  subjects: z.union([z.array(z.string().min(1)), z.record(z.any())]).optional().nullable(),
  desgination: z.enum(DESGINATION_ENUM).optional().nullable(),
  salary: z.number().nonnegative('Salary must be non-negative').optional().nullable(),
  is_active: z.boolean().optional(),
});

export const updateTeacherSchema = z.object({
  // allow partial updates — all optional
  name: z.string().min(1).max(100).optional(),
  address: z.string().min(1).optional(),
  date_of_birth: z.coerce.date().optional(),
  gender: z.enum(GENDER_ENUM).optional(),

  number: z.string().min(7).max(15).regex(phoneRegex).optional(),
  email: z.string().email().max(60).optional(),

  user_id: z.string().uuid().optional().nullable(),

  qualification: z.string().min(1).optional(),
  hire_date: z.coerce.date().optional(),
  subjects: z.union([z.array(z.string().min(1)), z.record(z.any())]).optional().nullable(),
  desgination: z.enum(DESGINATION_ENUM).optional().nullable(),
  salary: z.number().nonnegative().optional().nullable(),
  is_active: z.boolean().optional(),
});

export const filterTeacherSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),

  // date filters
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  // convenience filter for head master
  is_master: z.preprocess(
    (val) => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string') {
        const v = val.toLowerCase().trim();
        if (v === 'true' || v === '1' || v === 'yes') return true;
        if (v === 'false' || v === '0' || v === 'no') return false;
      }
      return undefined;
    },
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

  filters: z.union([z.string(), z.record(z.any())]).optional(),
  order: z.union([z.string(), z.array(z.array(z.string()))]).optional(),
});

export default {
  createTeacherSchema,
  updateTeacherSchema,
  filterTeacherSchema,
};
