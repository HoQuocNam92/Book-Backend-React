import * as cartRepo from './cart.repositories.js';
import prisma from '../../utils/prisma.js';
export const getCart = async (userId) => {
    return await cartRepo.getCartByUserId(userId);
};
export const addToCart = async (userId, input) => {
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
export const updateCartItemQty = async (userId, cartItemId, quantity) => {
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
    if (!cartItem || cartItem.Carts.user_id !== userId) {
        throw { status: 404, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };
    }
    return await cartRepo.updateCartItemQty(userId, cartItemId, quantity);
};
export const removeCartItem = async (userId, cartItemId) => {
    return await cartRepo.removeCartItem(userId, cartItemId);
};
export const clearCart = async (userId) => {
    return await cartRepo.clearCart(userId);
};
export const getCartItemCount = async (userId) => {
    return await cartRepo.getCartItemCount(userId);
};
