import { z } from "zod";

export const createCalendarSchema = z.object({
  title: z.string().min(1),

  event_type: z.enum([
    "Holiday",
    "Leave",
    "Exam",
    "Meeting",
    "Attendance",
  ]),

  event_date: z.string(),

  description: z.string().optional(),
});

export default {
  createCalendarSchema,
};