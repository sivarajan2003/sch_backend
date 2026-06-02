//leave.dto.js
import { z } from "zod";

export const createLeaveSchema = z.object({
  employee_name: z.string().min(1),

  employee_role: z.string().min(1),

  leave_type: z.enum([
    "Medical",
    "Emergency",
    "Casual",
    "Personal",
  ]),

  leave_from: z.coerce.date(),

  leave_to: z.coerce.date(),

  applied_on: z.coerce.date(),
});

export default {
  createLeaveSchema,
};