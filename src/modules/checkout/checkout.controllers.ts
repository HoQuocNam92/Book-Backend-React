import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../interfaces/IAuthRequest.js';
import * as checkoutServices from './checkout.services.js';

export const placeOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { address_id, payment_method } = req.body;

        if (!address_id) {
            return res.status(400).json({ message: 'Vui lòng chọn địa chỉ giao hàng' });
        }

        const order = await checkoutServices.placeOrder(
            userId,
            Number(address_id),
            payment_method || 'cod'
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
