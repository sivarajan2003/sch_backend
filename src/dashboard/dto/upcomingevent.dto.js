//upcomingevent.dto.js
import { z } from "zod";

export const createUpcomingEventSchema = z.object({
  title: z.string().min(1),

  event_date: z.string(),

  start_time: z.string(),

  end_time: z.string(),

  color: z.string().optional(),

  event_type: z.string().optional(),
});

export default {
  createUpcomingEventSchema,
};