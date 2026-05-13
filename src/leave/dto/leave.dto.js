//leave.dto.js
import { z } from "zod";

export const createLeaveSchema = z.object({
  employee_name: z.string(),

  leave_type: z.string(),

  from_date: z.string(),

  to_date: z.string(),

  reason: z.string(),
});

export default {
  createLeaveSchema,
};