import * as cartRepo from './cart.repositories';
import prisma from '../../utils/prisma';
import { AddToCartInput } from './cart.schema';

export const getCart = async (userId: number) => {
    return await cartRepo.getCartByUserId(userId);
};

export const addToCart = async (userId: number, input: AddToCartInput) => {
    const { book_id: bookId, quantity } = input;


    const book = await prisma.books.findUnique({ where: { id: bookId } });
    if (!book) {
        throw { status: 404, message: 'Không tìm thấy sản phẩm' };
    }
    if (book.status !== 'active') {
        throw { status: 400, message: 'Sản phẩm không khả dụng' };
    }
    if (book.stock < quantity) {
        throw { status: 400, message: `Chỉ còn ${book.stock} sản phẩm trong kho` };
    }

    return await cartRepo.addItemToCart(userId, bookId, quantity);
};

export const updateCartItemQty = async (userId: number, cartItemId: number, quantity: number) => {
    const cartItem = await prisma.cartItems.findUnique({
        where: { id: cartItemId },
        include: {
            Carts: {
                select: {
                    user_id: true
                }
            }
        }
    });

    if (!cartItem || cartItem.Carts!.user_id !== userId) {
        throw { status: 404, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };
    }
    return await cartRepo.updateCartItemQty(userId, cartItemId, quantity);
};

export const removeCartItem = async (userId: number, cartItemId: number) => {
    return await cartRepo.removeCartItem(userId, cartItemId);
};

export const clearCart = async (userId: number) => {
    return await cartRepo.clearCart(userId);
};

export const getCartItemCount = async (userId: number) => {
    return await cartRepo.getCartItemCount(userId);
};
