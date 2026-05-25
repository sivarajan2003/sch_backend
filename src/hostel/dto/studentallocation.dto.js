import { z } from 'zod';

export const createAllocationSchema =
  z.object({
    student: z.string(),

    regNo: z.string(),

    className: z.string(),

    hostel: z.string(),

    room: z.string(),

    bed: z.string(),

    date: z.string(),

    status: z.enum([
      'Active',
      'Pending',
    ]),
  });

export const updateAllocationSchema =
  createAllocationSchema.partial();

export default {
  createAllocationSchema,
  updateAllocationSchema,
};