import { z } from 'zod';

export const CouponCreateSchema = z.object({
    code: z.string().min(3, 'Mã giảm giá phải có ít nhất 3 ký tự').max(50, 'Mã giảm giá tối đa 50 ký tự'),
    discount: z.number().min(1, 'Giảm giá tối thiểu là 1%').max(100, 'Giảm giá tối đa là 100%'),
    expired_at: z.string().refine(
        (val) => !isNaN(Date.parse(val)),
        { message: 'Ngày hết hạn không hợp lệ' }
    ),
});

export const CouponUpdateSchema = CouponCreateSchema.partial();

export type CouponCreateInput = z.infer<typeof CouponCreateSchema>;
export type CouponUpdateInput = z.infer<typeof CouponUpdateSchema>;
