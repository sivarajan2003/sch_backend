//studentFaculty.dto.js
import { z } from "zod";

export const facultySchema = z.object({
  student_id: z.string().uuid(),
});

export default {
  facultySchema,
};