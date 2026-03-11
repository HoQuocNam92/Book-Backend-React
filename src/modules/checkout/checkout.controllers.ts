import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../interfaces/IAuthRequest.js';
import * as checkoutServices from './checkout.services.js';

export const placeOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { selectedAddress, paymentMethod, appliedCoupon, finalAmount } = req.body;

        if (!selectedAddress) {
            return res.status(400).json({ message: 'Vui lòng chọn địa chỉ giao hàng' });
        }

        const order = await checkoutServices.placeOrder(
            userId,
            Number(selectedAddress),
            paymentMethod || 'cod',
            appliedCoupon?.coupon_id,
            appliedCoupon?.code,
            finalAmount
        );

        res.status(201).json({ message: 'Đặt hàng thành công', data: order });
    } catch (error) {
        next(error);
    }
};

export const getUserAddresses = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const addresses = await checkoutServices.getUserAddresses(userId);
        res.status(200).json({ message: 'Lấy địa chỉ thành công', data: addresses });
    } catch (error) {
        next(error);
    }
};
