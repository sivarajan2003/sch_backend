//feepayment.dto
import { z } from 'zod';

export const createFeePaymentSchema = z.object({
  admission_id: z.string().uuid(),
  registration_fee: z.coerce.number().min(0),
  total_amount: z.coerce.number().min(1),
  payment_method: z.enum(['CARD', 'UPI', 'NET_BANKING', 'CASH']),
  payment_date: z.string(),
  is_active: z.boolean().optional(),
});

export const updateFeePaymentSchema = z.object({
  admission_id: z.string().uuid().optional(),
  registration_fee: z.coerce.number().min(0).optional(),
  total_amount: z.coerce.number().min(1).optional(),
  payment_method: z.enum(['CARD', 'UPI', 'NET_BANKING', 'CASH']).optional(),
  payment_date: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const filterFeePaymentSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export default {
  createFeePaymentSchema,
  updateFeePaymentSchema,
  filterFeePaymentSchema,
};
