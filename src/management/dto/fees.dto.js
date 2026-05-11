import { z } from 'zod';

export const createFeesSchema = z.object({
  id: z.string(),
  group: z.string(),
  description: z.string(),
  status: z.enum(["Active", "Inactive"])
});

export default {
  createFeesSchema
};