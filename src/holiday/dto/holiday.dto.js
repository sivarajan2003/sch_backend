import { z } from "zod";

export const createHolidaySchema = z.object({
  id: z.string(),
  title: z.string(),
  fromDate: z.string(),
  toDate: z.string(),
  description: z.string()
});

export default {
  createHolidaySchema
};