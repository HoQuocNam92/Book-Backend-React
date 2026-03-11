import { Request, Response, NextFunction } from 'express';
import * as couponService from './coupon.services';
import { CouponCreateSchema, CouponUpdateSchema } from './coupon.schema';
import { AuthRequest } from '../../interfaces/IAuthRequest';

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validateInput = CouponCreateSchema.parse(req.body);

        const { code, discount, discount_type, expired_at, start_at, min_order_value, max_discount, usage_limit } = validateInput;
        const coupon = await couponService.createCoupon({
            code,
            discount,
            discount_type: discount_type ?? 'percent',
            expired_at: new Date(expired_at),
            start_at: start_at && new Date(start_at),
            min_order_value,
            max_discount,
            usage_limit,
        });
        res.status(201).json({ success: true, message: 'Coupon created successfully', data: coupon });
    } catch (error: any) {
        next(error)

    }
};

export const getAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coupons = await couponService.getAllCoupons();
        res.status(200).json({ success: true, message: 'Get all coupons successfully', data: coupons });
    } catch (error: any) {
        next(error)

    }
};

export const getCouponById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const coupon = await couponService.getCouponById(id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        res.status(200).json({ success: true, message: 'Get coupon successfully', data: coupon });
    } catch (error: any) {
        next(error)
    }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const parsed = CouponUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
        }
        const dataToUpdate: any = {};
        if (parsed.data.code) dataToUpdate.code = parsed.data.code;
        if (parsed.data.discount !== undefined) dataToUpdate.discount = parsed.data.discount;
        if (parsed.data.discount_type) dataToUpdate.discount_type = parsed.data.discount_type;
        if (parsed.data.expired_at) dataToUpdate.expired_at = new Date(parsed.data.expired_at);
        if (parsed.data.start_at) dataToUpdate.start_at = new Date(parsed.data.start_at);
        if (parsed.data.min_order_value !== undefined) dataToUpdate.min_order_value = parsed.data.min_order_value;
        if (parsed.data.max_discount !== undefined) dataToUpdate.max_discount = parsed.data.max_discount;
        if (parsed.data.usage_limit !== undefined) dataToUpdate.usage_limit = parsed.data.usage_limit;

        const coupon = await couponService.updateCoupon(id, dataToUpdate);
        res.status(200).json({ success: true, message: 'Coupon updated successfully', data: coupon });
    } catch (error: any) {
        next(error)
    }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        await couponService.deleteCoupon(id);
        res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error: any) {
        next(error)
    }
};

export const validateCoupon = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const order_total = req.body?.finalAmount
        const code = String(req.params.code);
        const user = req.user;
        const coupon = await couponService.validateCouponByCode(code, Number(user?.id), order_total);
        res.status(200).json({
            success: true,
            message: 'Mã giảm giá hợp lệ',
            data: { code: coupon.code, discount: coupon.discount, discount_type: coupon.discount_type, coupon_id: coupon.id }
        });
    } catch (error: any) {
        next(error)
    }
};
