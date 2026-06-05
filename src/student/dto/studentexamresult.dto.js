//studentexamresult.dto.js
import { z } from "zod";

export const createStudentExamResultSchema =
  z.object({
    student_id: z.string().uuid(),
    quarter: z.string(),
    subject: z.string(),
    mark: z.number().min(0).max(100),
  });

export default {
  createStudentExamResultSchema,
};