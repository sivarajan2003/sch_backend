// student.dto.js
import { z } from "zod";

/**
 * Student DTO validation schemas (Zod)
 * Matches the Student model fields.
 *
 * Required for create:
 * - name, date_of_birth, gender, parent_id,
 *   yearofjoining, roll_number, blood_group,
 *   admission_number, admission_date, academic_year
 *
 * age is optional (service will auto-calculate if missing)
 */

const GENDER_ENUM = ["Male", "Female", "Other"];
const BLOOD_GROUP_ENUM = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

// phone regex kept if you want to add phone later
const phoneRegex = /^[+\d]?(?:[\d -]{7,14})$/;

export const createStudentSchema = z.object({
  // personal info
  name: z.string().min(1, "Name is required").max(100),

  // date_of_birth required (used to compute age)
  date_of_birth: z.coerce.date({ required_error: "Date of birth is required" }),

  // gender required
  gender: z.enum(GENDER_ENUM, { required_error: "Gender is required" }),

  // age optional (service may compute it)
  age: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional()
    .nullable(),

  // blood group optional (but model expects it non-null) — keep optional if you compute/require elsewhere
  blood_group: z.enum(BLOOD_GROUP_ENUM).optional().nullable(),

  // contact / address
  address: z.string().optional().nullable(),
  profile_image: z.string().optional().nullable(),

  // academics — required to match model
  yearofjoining: z.coerce
    .number({ invalid_type_error: "yearofjoining must be a number" })
    .int()
    .min(1900, "yearofjoining seems invalid")
    .required ? z.coerce.number().int().min(1900) : z.coerce.number().int().min(1900),
  roll_number: z.coerce
    .number({ invalid_type_error: "roll_number must be a number" })
    .int()
    .min(0, "roll_number must be >= 0"),
  admission_number: z.string().min(1, "admission_number is required").max(50),
  admission_date: z.coerce.date({ required_error: "admission_date is required" }),
  academic_year: z.string().min(1, "academic_year is required").max(50),

  // relations
  parent_id: z.string().uuid({ message: "Parent ID must be a valid UUID" }),

  // link to an academic config (optional)
  current_academic_config_id: z.string().uuid().optional().nullable(),

  // is_active optional
  is_active: z.boolean().optional().default(true),

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

export const updateStudentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  date_of_birth: z.coerce.date().optional(),
  gender: z.enum(GENDER_ENUM).optional(),
  age: z.coerce.number().int().nonnegative().optional().nullable(),
  blood_group: z.enum(BLOOD_GROUP_ENUM).optional().nullable(),

  // contact
  address: z.string().optional().nullable(),
  profile_image: z.string().optional().nullable(),

  // academics
  yearofjoining: z.coerce.number().int().min(1900).optional(),
  roll_number: z.coerce.number().int().min(0).optional(),
  admission_number: z.string().min(1).max(50).optional(),
  admission_date: z.coerce.date().optional(),
  academic_year: z.string().min(1).max(50).optional(),

  parent_id: z.string().uuid().optional(),
  current_academic_config_id: z.string().uuid().optional().nullable(),

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

export const filterStudentSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(200).default(10),
  search: z.string().optional(),

  // allow filtering by current academic config
  current_academic_config_id: z.string().uuid().optional(),

  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  includeAudit: z.preprocess(
    (v) => (v === "true" || v === "1" || v === true ? true : false),
    z.boolean().optional()
  ),
  includeDeleted: z.preprocess(
    (v) => (v === "true" || v === "1" || v === true ? true : false),
    z.boolean().optional()
  ),

  // whether to include related Parent or AcademicConfig in results
  includeParent: z.preprocess(
    (v) => (v === "true" || v === "1" || v === true ? true : false),
    z.boolean().optional()
  ),
  includeAcademicConfig: z.preprocess(
    (v) => (v === "true" || v === "1" || v === true ? true : false),
    z.boolean().optional()
  ),

  filters: z.union([z.string(), z.record(z.any())]).optional(),
  order: z.union([z.string(), z.array(z.array(z.string()))]).optional(),
});

export default {
  createStudentSchema,
  updateStudentSchema,
  filterStudentSchema,
};
