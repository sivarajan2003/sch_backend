//hr.dto.js
import { z } from "zod";

/**
 * HR (Candidate) DTO validation
 * Based on your hr.model.js
 */

const STATUS_ENUM = ["Interview", "Selected", "Rejected"];

// simple phone validation
const phoneRegex = /^[+\d]?(?:[\d -]{7,14})$/;

/* =========================
   CREATE CANDIDATE
========================= */
export const createCandidateSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z.string().email("Invalid email"),

  phone: z.string().optional().nullable(),

  qualification: z.string().optional().nullable(),

  status: z.enum(STATUS_ENUM).optional(),

  salary_pending: z.number().optional(),
});
/* =========================
   UPDATE CANDIDATE
========================= */
export const updateCandidateSchema = z.object({
  name: z.string().min(1).max(100).optional(),

  email: z.string().email().optional(),

  phone: z.string().regex(phoneRegex).optional(),

  qualification: z.string().optional(),

  status: z.enum(STATUS_ENUM).optional(),

  salary_pending: z.number().nonnegative().optional(),
});

/* =========================
   FILTER (OPTIONAL)
========================= */
export const filterCandidateSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().optional(),

  status: z.enum(STATUS_ENUM).optional(),
});

export default {
  createCandidateSchema,
  updateCandidateSchema,
  filterCandidateSchema,
};