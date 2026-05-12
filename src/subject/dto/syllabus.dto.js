import { z } from "zod";

export const createSyllabusSchema =
  z.object({

    class_name: z.string(),

    section: z.string(),

    subject_group: z.string(),

    is_active:
      z.boolean().optional()

  });

export default {
  createSyllabusSchema
};