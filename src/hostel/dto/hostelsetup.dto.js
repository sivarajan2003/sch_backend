//hostelsetup.dto.js
import { z } from 'zod';

export const createHostelSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['Boys', 'Girls', 'Staff']),
  rooms: z.number(),
  capacity: z.number(),
  warden: z.string(),
  status: z.enum(['Active', 'Inactive']).optional(),
});

export const updateHostelSchema = createHostelSchema.partial();

export default {
  createHostelSchema,
  updateHostelSchema,
};