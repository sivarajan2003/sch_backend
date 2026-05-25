import { z } from 'zod';

const createAttendanceSchema =
  z.object({

    student: z.string(),

    regNo: z.string(),

    hostel: z.string(),

    room: z.string(),

    checkIn: z.string(),

    checkOut: z.string(),

    status: z.string(),

    entryType: z.string(),
  });

export default {
  createAttendanceSchema,
};