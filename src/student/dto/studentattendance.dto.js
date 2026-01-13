// studentattendance.dto.js
import { z } from "zod";

/**
 * Student Attendance DTO validation schemas
 * Matches the StudentAttendance model fields.
 *
 * Required for create:
 * - student_id, attendanceDate
 * Optional:
 * - status, taken_by, is_active, audit fields
 */

const STATUS_ENUM = ["Present", "Absent", "Late"];

// Create Attendance Schema
export const createAttendanceSchema = z.object({
  student_id: z.string().uuid({ message: "student_id must be a valid UUID" }),
  attendanceDate: z.coerce.date({ required_error: "attendanceDate is required" }),
  status: z.enum(STATUS_ENUM).optional().default("Present"),
  taken_by: z.string().uuid().optional().nullable(),
  is_active: z.boolean().optional().default(true),

  // Audit / metadata
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

// Update Attendance Schema
export const updateAttendanceSchema = z.object({
  student_id: z.string().uuid().optional(),
  attendanceDate: z.coerce.date().optional(),
  status: z.enum(STATUS_ENUM).optional(),
  taken_by: z.string().uuid().optional().nullable(),
  is_active: z.boolean().optional(),

  // Audit / metadata
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

// Filter / Pagination Schema
export const filterAttendanceSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(200).default(10),
  search: z.string().optional(),

  student_id: z.string().uuid().optional(),
  teacher_id: z.string().uuid().optional(),
  status: z.enum(STATUS_ENUM).optional(),

  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  includeDeleted: z.preprocess(
    (v) => v === "true" || v === "1" || v === true ? true : false,
    z.boolean().optional()
  ),

  order: z.union([z.string(), z.array(z.array(z.string()))]).optional(),
});

export default {
  createAttendanceSchema,
  updateAttendanceSchema,
  filterAttendanceSchema,
};
