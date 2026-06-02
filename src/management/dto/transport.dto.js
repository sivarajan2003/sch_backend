//transport.dto.js
import { z } from "zod";

export const createTransportSchema = z.object({
  id: z.string(),

  route: z.string(),

  status: z.enum([
    "Active",
    "Inactive"
  ]),

  date: z.string()
});

export default {
  createTransportSchema
};