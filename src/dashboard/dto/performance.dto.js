//performance.dto.js
import { z } from "zod";

export const createPerformanceSchema = z.object({
  class_name: z.string(),

  top_students: z.number(),

  average_students: z.number(),

  below_average_students: z.number(),

  performance_percentage: z.number(),
});

export default {
  createPerformanceSchema,
};