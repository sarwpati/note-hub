import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long').optional(),
    currentPassword: z.string().min(8, 'Current password is required').optional(),
    newPassword: z.string().min(8, 'New password must be at least 8 characters').max(128, 'Password is too long').optional(),
  })
  .refine((data) => !(data.newPassword && !data.currentPassword), {
    message: 'Current password is required when setting a new password',
    path: ['currentPassword'],
  })
  .refine((data) => !(data.currentPassword && !data.newPassword), {
    message: 'New password is required when updating the current password',
    path: ['newPassword'],
  });
