import { z } from 'zod';

// DTO for creating a new AdminUser
export const createAdminUserSchema = z.object({
  role: z.enum(["Super Admin", "Admin", "School Admin"]).optional(),
  username: z.string().min(3).max(50),
  email: z.string().email().max(60),
  password: z.string().min(6).max(255),
  phone: z.string().max(15).optional(),
});

// DTO for updating an AdminUser (PUT)
export const updateAdminUserSchema = z.object({
  role: z.enum(["Super Admin", "Admin", "School Admin"]).optional(),
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().max(60).optional(),
  phone: z.string().max(15).optional(),
  is_active: z.boolean().optional(),
});

// DTO for partial update (PATCH)
export const patchAdminUserSchema = updateAdminUserSchema.partial();

// DTO for login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// DTO for refresh token
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10),
});

// DTO for change password
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export default {
  createAdminUserSchema,
  updateAdminUserSchema,
  patchAdminUserSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
};