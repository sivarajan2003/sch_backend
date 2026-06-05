//studentexam.dto.js
import { z } from "zod";

export const createExamSchema = z.object({
  student_id: z.string().uuid(),
  subject: z.string(),
  exam_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  room_no: z.string(),
});

export default {
  createExamSchema,
};