//noticeboard.dto.js
import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  notice_date: z.string(),
  expiry_days: z.number(),
  notice_type: z.string(),
});

export default {
  createNoticeSchema,
};
