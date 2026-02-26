"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordSchema = exports.emailSchema = exports.signInSchema = exports.signUpSchema = void 0;
const zod_1 = require("zod");
exports.signUpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email không hợp lệ'),
    password: zod_1.z.string().min(6, 'Password tối thiểu 6 ký tự'),
    name: zod_1.z.string().min(1, 'Name không được rỗng'),
});
exports.signInSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email không hợp lệ'),
    password: zod_1.z.string().min(6, 'Password tối thiểu 6 ký tự'),
});
exports.emailSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email không hợp lệ'),
});
exports.passwordSchema = zod_1.z.object({
    password: zod_1.z.string().min(6, 'Password tối thiểu 6 ký tự'),
});
