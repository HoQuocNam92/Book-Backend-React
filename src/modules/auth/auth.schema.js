import { z } from 'zod';
export const signUpSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Password tối thiểu 6 ký tự'),
    name: z.string().min(1, 'Name không được rỗng'),
});
export const signInSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Password tối thiểu 6 ký tự'),
});
export const emailSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
});
export const passwordSchema = z.object({
    password: z.string().min(6, 'Password tối thiểu 6 ký tự'),
});
