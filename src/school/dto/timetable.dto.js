// timetable.dto.js
import { z } from 'zod';

const uuidOrNull = (msg = 'Invalid UUID') =>
  z.string().uuid({ message: msg }).optional().nullable();

// Allowed values
const dayEnum = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]);

const periodEnum = z.enum([
  "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"
]);

// CREATE schema
export const createTimetableSchema = z.object({
  class_id: z.string().uuid({ message: 'class_id must be a valid UUID' }),
  subject_id: z.string().uuid({ message: 'subject_id must be a valid UUID' }),
  academicyear_id: z.string().uuid({ message: 'academicyear_id must be a valid UUID' }),

  day_of_week: dayEnum,
  period_number: periodEnum,

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
  //teacher_id: z.string().uuid(),

start_time: z.string(),

end_time: z.string(),

period_type: z.enum([
   "CLASS",
   "BREAK",
   "LUNCH"
]),
});

// UPDATE schema
export const updateTimetableSchema = z.object({
  class_id: z.string().uuid().optional(),
  subject_id: z.string().uuid().optional(),
  academicyear_id: z.string().uuid().optional(),

  day_of_week: dayEnum.optional(),
  period_number: periodEnum.optional(),

  is_active: z.boolean().optional(),

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

// FILTER schema
export const filterTimetableSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(500).default(10),
  search: z.string().optional(),

  academicyear_id: z.string().uuid().optional(),
  class_id: z.string().uuid().optional(),
  subject_id: z.string().uuid().optional(),

  day_of_week: dayEnum.optional(),
  period_number: periodEnum.optional(),

  is_active: z.preprocess(
    (v) =>
      v === 'true' || v === '1' || v === true
        ? true
        : v === 'false' || v === '0'
        ? false
        : undefined,
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

  filters: z.union([z.string(), z.record(z.any())]).optional(),
  order: z.union([z.string(), z.array(z.array(z.string()))]).optional(),
});

export default {
  createTimetableSchema,
  updateTimetableSchema,
  filterTimetableSchema,
};
