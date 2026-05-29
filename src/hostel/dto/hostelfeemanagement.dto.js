//hostelfeemanagement.dto.js
import { z } from 'zod';

export const createHostelFeeSchema =
  z.object({
    student: z.string(),
    regNo: z.string(),
    hostel: z.string(),
    room: z.string(),
    total: z.number(),
    paid: z.number(),
    balance: z.number(),
    dueDate: z.string(),
    status: z.string(),
    year: z.string(),
  });

export const updateHostelFeeSchema =
  z.object({
    student: z.string().optional(),
    regNo: z.string().optional(),
    hostel: z.string().optional(),
    room: z.string().optional(),
    total: z.number().optional(),
    paid: z.number().optional(),
    balance: z.number().optional(),
    dueDate: z.string().optional(),
    status: z.string().optional(),
    year: z.string().optional(),
  });

export default {
  createHostelFeeSchema,
  updateHostelFeeSchema,
};