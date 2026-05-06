//teacher.dto.js
import { z } from "zod";

export const createTeacherSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  qualification: z.string().optional(),
  phone: z.string().optional(),
});

export default {
  createTeacherSchema,
};