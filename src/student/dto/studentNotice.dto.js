//studentNotice.dto.js
import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z.string().min(1),

  description: z.string().optional(),

  notice_type: z.enum([
    "Admin",
    "Class Teacher",
    "Subject Teacher",
  ]),

  class_id: z.string().uuid().optional(),

  subject: z.string().optional(),
});

export default {
  createNoticeSchema,
};