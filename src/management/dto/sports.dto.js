import { z } from "zod";

export const createSportsSchema = z.object({
  name: z.string(),
  coach: z.string(),
  avatar: z.string().optional(),
  year: z.number()
});

export default { createSportsSchema };
