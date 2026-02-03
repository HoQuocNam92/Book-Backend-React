import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Email không hợp lệ'),

  password: z.string().min(6, 'Password tối thiểu 6 ký tự'),

  name: z.string().min(1, 'Name không được rỗng'),
});

export type signUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Password tối thiểu 6 ký tự'),
});

export type signInInput = z.infer<typeof signInSchema>;

export const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

export type emailInput = z.infer<typeof emailSchema>;

export const passwordSchema = z.object({
  password: z.string().min(6, 'Password tối thiểu 6 ký tự'),
});

export type passwordInput = z.infer<typeof passwordSchema>;
