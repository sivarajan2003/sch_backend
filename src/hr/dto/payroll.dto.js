//payroll.dto.js
import { z } from "zod";

export const createPayrollSchema = z.object({
  name: z.string().min(1),
  basic: z.number(),
  allowance: z.number().optional(),
  deduction: z.number().optional(),
  month: z.string(),
});

export default {
  createPayrollSchema,
};