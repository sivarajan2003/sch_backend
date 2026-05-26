import { z } from 'zod';

export const createAttendanceSchema = z.object({
  person_id: z.string().uuid(),
  person_name: z.string().min(1),
  person_type: z.enum(['Student', 'Teacher', 'Staff']),
  attendance_status: z.enum(['Present', 'Absent', 'Late', 'Halfday', 'Holiday']),
  attendance_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  notes: z.string().optional().nullable(),
});

export const saveTeacherAttendanceSchema = z.object({
  attendance_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  records: z.array(
    z.object({
      person_id: z.string().uuid(),
      person_name: z.string().min(1),
      attendance_status: z.enum(['Present', 'Absent', 'Late', 'Halfday', 'Holiday']),
      notes: z.string().optional().nullable(),
    })
  ).min(1),
});

export default {
  createAttendanceSchema,
  saveTeacherAttendanceSchema,
};
