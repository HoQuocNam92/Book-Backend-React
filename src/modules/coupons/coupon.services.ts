import * as couponRepository from './coupon.repositories';
import * as cartRepo from '../cart/cart.repositories';
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

export const validateCouponByCode = async (code: string, userId: number, order_total: number) => {
    console.log("Check code", code);
    const coupon = await couponRepository.getCouponByCode(code);
    const cart = await cartRepo.getCartTotalPrice(userId);
    if (cart === null) {
        throw new Error('CART_IS_EMPTY');
    }
    if (cart) {
        if (cart < coupon?.min_order_value!) {
            console.log('Cart total:', cart);
            throw new Error('NOT_ENOUGH_ORDER_VALUE');
        }
        if (coupon?.usage_limit !== null && coupon?.usage_limit! <= 0) {
            throw new Error('CODE_USAGE_LIMIT_REACHED');
        }

    }
    if (!coupon) {
        throw new Error('CODE_NOT_FOUND');
    }
    if (new Date(coupon.expired_at!) < new Date()) {
        throw new Error('CODE_EXPIRED');
    }
    const total = order_total * (Number(coupon.discount) / 100);
    const discount =
        total > Number(coupon.max_discount)
            ? Number(coupon.max_discount)
            : total;



    return {
        ...coupon,
        discount,
    };
};
