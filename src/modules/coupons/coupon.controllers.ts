import { Request, Response } from 'express';
import * as couponService from './coupon.services';
import { CouponCreateSchema, CouponUpdateSchema } from './coupon.schema';

export const createCoupon = async (req: Request, res: Response) => {
    try {
        const parsed = CouponCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
        }
        const { code, discount, expired_at } = parsed.data;
        const coupon = await couponService.createCoupon({
            code,
            discount,
            expired_at: new Date(expired_at)
        });
        res.status(201).json({ success: true, message: 'Coupon created successfully', data: coupon });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getAllCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await couponService.getAllCoupons();
        res.status(200).json({ success: true, message: 'Get all coupons successfully', data: coupons });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCouponById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const coupon = await couponService.getCouponById(id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        res.status(200).json({ success: true, message: 'Get coupon successfully', data: coupon });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCoupon = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const parsed = CouponUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
        }
        const dataToUpdate: any = {};
        if (parsed.data.code) dataToUpdate.code = parsed.data.code;
        if (parsed.data.discount) dataToUpdate.discount = parsed.data.discount;
        if (parsed.data.expired_at) dataToUpdate.expired_at = new Date(parsed.data.expired_at);

        const coupon = await couponService.updateCoupon(id, dataToUpdate);
        res.status(200).json({ success: true, message: 'Coupon updated successfully', data: coupon });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await couponService.deleteCoupon(id);
        res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const validateCoupon = async (req: Request, res: Response) => {
    try {
        const code = String(req.params.code);
        const coupon = await couponService.validateCouponByCode(code);
        res.status(200).json({
            success: true,
            message: 'Mã giảm giá hợp lệ',
            data: { code: coupon.code, discount: coupon.discount }
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
