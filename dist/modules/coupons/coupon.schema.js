"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponUpdateSchema = exports.CouponCreateSchema = void 0;
const zod_1 = require("zod");
exports.CouponCreateSchema = zod_1.z.object({
    code: zod_1.z.string().min(3, 'Mã giảm giá phải có ít nhất 3 ký tự').max(50, 'Mã giảm giá tối đa 50 ký tự'),
    discount: zod_1.z.number().min(1, 'Giảm giá tối thiểu là 1%').max(100, 'Giảm giá tối đa là 100%'),
    expired_at: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Ngày hết hạn không hợp lệ' }),
});
exports.CouponUpdateSchema = exports.CouponCreateSchema.partial();
