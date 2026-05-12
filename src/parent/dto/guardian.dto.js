import { z } from "zod";

export const createGuardianSchema = z.object({
  guardian_id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  child_name: z.string(),
  image: z.string().optional().nullable(),
});

export const updateGuardianSchema = createGuardianSchema.partial();

export default {
  createGuardianSchema,
  updateGuardianSchema,
};