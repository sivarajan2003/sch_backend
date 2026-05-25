//roommanagement.dto.js
import { z } from 'zod';

export const createRoomSchema = z.object({
  roomNo: z.string().min(1),
  hostel: z.string().min(1),
  floor: z.string().min(1),

  capacity: z.coerce.number(),

  occupied: z.coerce.number(),

  type: z.string().min(1),

  status: z.enum([
    'Available',
    'Full',
    'Maintenance',
  ]),
});

export const updateRoomSchema =
  createRoomSchema.partial();

export default {
  createRoomSchema,
  updateRoomSchema,
};