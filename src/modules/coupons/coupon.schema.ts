import { z } from 'zod';

export const CouponCreateSchema = z.object({
    code: z.string().min(3, 'Mã giảm giá phải có ít nhất 3 ký tự').max(50, 'Mã giảm giá tối đa 50 ký tự'),
    discount: z.number().min(0, 'Giảm giá không được âm'),
    discount_type: z.enum(['percent', 'fixed']).optional().default('percent'),
    expired_at: z.string().refine(
        (val) => !isNaN(Date.parse(val)),
        { message: 'Ngày hết hạn không hợp lệ' }
    ),
    start_at: z.string().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: 'Ngày bắt đầu không hợp lệ' }
    ),
    end_at: z.string().optional().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: 'Ngày kết thúc không hợp lệ' }
    ),
    min_order_value: z.number().min(0),
    max_discount: z.number().min(0),
    usage_limit: z.number().min(1)
});

export const CouponUpdateSchema = CouponCreateSchema.partial();

export type CouponCreateInput = z.infer<typeof CouponCreateSchema>;
export type CouponUpdateInput = z.infer<typeof CouponUpdateSchema>;
