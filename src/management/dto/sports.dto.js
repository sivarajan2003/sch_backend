import { z } from "zod";

export const createSportsSchema = z.object({
  sportId: z.string(),

  name: z.string(),

  coach: z.string(),

  avatar: z.string().optional(),

  year: z.number()
});

export default {
  createSportsSchema
};