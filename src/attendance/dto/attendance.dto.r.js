import { z } from 'zod';

export const createAttendanceSchema = z.object({
  person_id: z.string(),
  person_name: z.string(),
  person_type: z.enum([
    "Student",
    "Teacher",
    "Staff"
  ]),
  attendance_status: z.enum([
    "Present",
    "Absent",
    "Late",
    "Halfday",
    "Holiday"
  ]),
  attendance_date: z.string()
});

export default {
  createAttendanceSchema
};