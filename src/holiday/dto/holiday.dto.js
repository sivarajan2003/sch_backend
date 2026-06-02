//holiday.dto.js
import { z } from "zod";

export const createHolidaySchema = z.object({
  title: z.string(),
  from_date: z.string(),
  to_date: z.string(),
  description: z.string()
});

export default {
  createHolidaySchema
};