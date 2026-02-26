import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../interfaces/IAuthRequest.js';
import * as cartServices from './cart.services.js';
import { AddToCartSchema, UpdateCartItemQtySchema } from './cart.schema.js';

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const cart = await cartServices.getCart(userId);
        res.status(200).json({ message: 'Lấy giỏ hàng thành công', data: cart });
    } catch (error) {
        next(error);
    }
};

export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { book_id, quantity } = req.body;

        const validateInput = AddToCartSchema.parse({ book_id, quantity });

        const cart = await cartServices.addToCart(userId, validateInput);
        res.status(200).json({ message: 'Thêm vào giỏ hàng thành công', data: cart });
    } catch (error) {
        next(error);
    }
};

export const updateCartItemQty = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const cartItemId = parseInt(req.params.id as string);
        const { quantity } = req.body;
        const validateInput = UpdateCartItemQtySchema.parse({ quantity });

        if (isNaN(cartItemId)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }

        const cart = await cartServices.updateCartItemQty(userId, cartItemId, validateInput.quantity);
        res.status(200).json({ message: 'Cập nhật số lượng thành công', data: cart });
    } catch (error) {
        next(error);
    }
};

export const removeCartItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const cartItemId = parseInt(req.params.id as string);

        if (isNaN(cartItemId)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }

        const cart = await cartServices.removeCartItem(userId, cartItemId);
        res.status(200).json({ message: 'Xóa sản phẩm thành công', data: cart });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const cart = await cartServices.clearCart(userId);
        res.status(200).json({ message: 'Đã xóa toàn bộ giỏ hàng', data: cart });
    } catch (error) {
        next(error);
    }
};

export const getCartItemCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const count = await cartServices.getCartItemCount(userId);
        res.status(200).json({ data: count });
    } catch (error) {
        next(error);
    }
};
