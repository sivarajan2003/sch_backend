//attendance.dto.js
import { z } from "zod";

export const createAttendanceSchema = z.object({
  attendance_type: z.enum([
    "Students",
    "Teachers",
    "Staff",
  ]),

  present: z.number(),
  absent: z.number(),
  emergency: z.number(),
  late: z.number(),

  attendance_date: z.coerce.date(),
});

export default {
  createAttendanceSchema,
};