import { z } from 'zod';

/**
 * Class Allocation DTO validation schemas (Zod)
 * MUST match Sequelize ClassAllocation model exactly
 */

/* ============================
   COMMON
============================ */

const UUID = z.string().uuid();

/* ============================
   CREATE CLASS ALLOCATION
============================ */

export const createClassAllocationSchema = z.object({
  class_id: UUID,
  admission_id: UUID,
  allocated_by: UUID,

  is_active: z.boolean().default(true),

  // Meta
  created_by: UUID.optional().nullable(),
  created_by_name: z.string().optional().nullable(),
  created_by_email: z.string().email().optional().nullable(),
});

/* ============================
   REALLOCATE CLASS
============================ */

export const reallocateClassSchema = z.object({
  admission_id: UUID,
  new_class_id: UUID,

  // Meta
  updated_by: UUID.optional().nullable(),
  updated_by_name: z.string().optional().nullable(),
  updated_by_email: z.string().email().optional().nullable(),
});

/* ============================
   DEACTIVATE ALLOCATION
============================ */

export const deactivateClassAllocationSchema = z.object({
  deleted_by: UUID.optional().nullable(),
  deleted_by_name: z.string().optional().nullable(),
  deleted_by_email: z.string().email().optional().nullable(),
});

/* ============================
   FILTER / LIST CLASS ALLOCATIONS
============================ */

export const filterClassAllocationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  filters: z.union([z.string(), z.record(z.any())]).optional(),

  order: z
    .union([z.string(), z.array(z.array(z.string()))])
    .optional(),
});

/* ============================
   GET BY ADMISSION ID
============================ */

export const getAllocationByAdmissionSchema = z.object({
  admission_id: UUID,
});

/* ============================
   EXPORTS
============================ */

export default {
  createClassAllocationSchema,
  reallocateClassSchema,
  deactivateClassAllocationSchema,
  filterClassAllocationSchema,
  getAllocationByAdmissionSchema,
};
