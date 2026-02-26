"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartItemCount = exports.clearCart = exports.removeCartItem = exports.updateCartItemQty = exports.addItemToCart = exports.getCartByUserId = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const getCartByUserId = async (userId) => {
    let cart = await prisma_js_1.default.carts.findUnique({
        where: { user_id: userId },
        include: {
            CartItems: {
                include: {
                    Books: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            price: true,
                            sale_price: true,
                            discount_percent: true,
                            BookImages: {
                                take: 1,
                                select: { url: true },
                            },
                        },
                    },
                },
            },
        },
    });
    return {
        id: cart?.id,
        items: cart?.CartItems.map((item) => {
            const book = item.Books;
            const price = Number(book?.price || 0);
            const salePrice = book?.sale_price ? Number(book.sale_price) : 0;
            const finalPrice = salePrice > 0 ? salePrice : price;
            return {
                id: item.id,
                book_id: item.book_id,
                quantity: item.quantity,
                title: book?.title || '',
                slug: book?.slug || '',
                price,
                sale_price: salePrice,
                final_price: finalPrice,
                discount_percent: book?.discount_percent || 0,
                image: book?.BookImages?.[0]?.url || null,
                subtotal: finalPrice * (item.quantity || 0),
            };
        }),
    };
};
exports.getCartByUserId = getCartByUserId;
const addItemToCart = async (userId, bookId, quantity) => {
    return await prisma_js_1.default.$transaction(async (tx) => {
        try {
            let cart = await tx.carts.findUnique({ where: { user_id: userId } });
            if (!cart) {
                cart = await tx.carts.create({ data: { user_id: userId } });
            }
            const existingItem = await tx.cartItems.findFirst({
                where: { cart_id: cart.id, book_id: bookId },
            });
            if (existingItem) {
                await tx.cartItems.update({
                    where: { id: existingItem.id },
                    data: { quantity: (existingItem.quantity || 0) + quantity },
                });
            }
            else {
                await tx.cartItems.create({
                    data: {
                        cart_id: cart.id,
                        book_id: bookId,
                        quantity,
                    },
                });
            }
            return cart;
        }
        catch (error) {
            throw new Error('ERROR_ADDING_TO_CART');
        }
    });
};
exports.addItemToCart = addItemToCart;
const updateCartItemQty = async (userId, cartItemId, quantity) => {
    const cart = await prisma_js_1.default.carts.findUnique({ where: { user_id: userId } });
    if (!cart)
        throw new Error('NOT_FOUND_ITEMS_IN_CART');
    const item = await prisma_js_1.default.cartItems.findFirst({
        where: { id: cartItemId, cart_id: cart.id },
    });
    if (!item)
        throw new Error('NOT_FOUND_ITEMS_IN_CART');
    if (quantity <= 0) {
        await prisma_js_1.default.$transaction(async (tx) => {
            try {
                await tx.carts.delete({ where: { id: cart.id } });
                await tx.cartItems.delete({ where: { id: cartItemId } });
            }
            catch (error) {
                throw new Error('ERROR_DELETING_CART_ITEM');
            }
        });
    }
    else {
        await prisma_js_1.default.cartItems.update({
            where: { id: cartItemId },
            data: { quantity },
        });
    }
    return (0, exports.getCartByUserId)(userId);
};
exports.updateCartItemQty = updateCartItemQty;
const removeCartItem = async (userId, cartItemId) => {
    const cart = await prisma_js_1.default.carts.findUnique({ where: { user_id: userId } });
    if (!cart)
        throw new Error('NOT_FOUND_CART');
    const item = await prisma_js_1.default.cartItems.findFirst({
        where: { id: cartItemId, cart_id: cart.id },
    });
    if (!item)
        throw new Error('NOT_FOUND_ITEMS_IN_CART');
    await prisma_js_1.default.cartItems.delete({ where: { id: cartItemId } });
    return (0, exports.getCartByUserId)(userId);
};
exports.removeCartItem = removeCartItem;
const clearCart = async (userId) => {
    const cart = await prisma_js_1.default.carts.findUnique({ where: { user_id: userId } });
    if (!cart)
        return { id: 0, items: [] };
    await prisma_js_1.default.$transaction(async (tx) => {
        try {
            await tx.carts.deleteMany({ where: { id: cart.id } });
        }
        catch (error) {
            throw new Error('ERROR_CLEARING_CART');
        }
    });
    return { id: cart.id, items: [] };
};
exports.clearCart = clearCart;
const getCartItemCount = async (userId) => {
    const cart = await prisma_js_1.default.carts.findUnique({ where: { user_id: userId } });
    if (!cart)
        return 0;
    const result = await prisma_js_1.default.cartItems.aggregate({
        where: { cart_id: cart.id },
        _sum: { quantity: true },
    });
    return result._sum.quantity || 0;
};
exports.getCartItemCount = getCartItemCount;
