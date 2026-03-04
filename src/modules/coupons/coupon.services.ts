import * as couponRepository from './coupon.repositories';
import { Prisma } from '@prisma/client';

export const createCoupon = async (data: Prisma.CouponsCreateInput) => {
    const existingCoupon = await couponRepository.getCouponByCode(data.code as string);
    if (existingCoupon) {
        throw new Error('Coupon code already exists');
    }
    return await couponRepository.createCoupon(data);
};

export const getAllCoupons = async () => {
    return await couponRepository.getAllCoupons();
};

export const getCouponById = async (id: number) => {
    return await couponRepository.getCouponById(id);
};

export const updateCoupon = async (id: number, data: Prisma.CouponsUpdateInput) => {
    const existingCoupon = await couponRepository.getCouponById(id);
    if (!existingCoupon) {
        throw new Error('Coupon not found');
    }
    if (data.code && data.code !== existingCoupon.code) {
        const checkCode = await couponRepository.getCouponByCode(data.code as string);
        if (checkCode) {
            throw new Error('Coupon code already exists');
        }
    }
    return await couponRepository.updateCoupon(id, data);
};

export const deleteCoupon = async (id: number) => {
    const existingCoupon = await couponRepository.getCouponById(id);
    if (!existingCoupon) {
        throw new Error('Coupon not found');
    }
    return await couponRepository.deleteCoupon(id);
};
