import { z } from 'zod';

export const createComplaintSchema = z.object({
  student: z.string().min(1),
  regNo: z.string().optional(),

  hostel: z.string().min(1),

  room: z.string().min(1),

  issue: z.string().min(1),

  priority: z.enum([
    'High',
    'Medium',
    'Low',
  ]),

  status: z
    .enum([
      'Pending',
      'In Progress',
      'Resolved',
    ])
    .optional(),

  date: z.string(),
});

export const updateComplaintSchema =
  createComplaintSchema.partial();

export default {
  createComplaintSchema,
  updateComplaintSchema,
};