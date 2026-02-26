"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAddresses = exports.placeOrder = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
// Place order from cart
const placeOrder = async (userId, addressId, paymentMethod) => {
    return await prisma_js_1.default.$transaction(async (tx) => {
        // 1. Get cart with items
        const cart = await tx.carts.findUnique({
            where: { user_id: userId },
            include: {
                CartItems: {
                    include: {
                        Books: {
                            select: {
                                id: true,
                                title: true,
                                price: true,
                                sale_price: true,
                                stock: true,
                                status: true,
                            },
                        },
                    },
                },
            },
        });
        if (!cart || cart.CartItems.length === 0) {
            throw { status: 400, message: 'Giỏ hàng trống' };
        }
        // 2. Validate stock and calculate total
        let total = 0;
        const orderItemsData = [];
        for (const item of cart.CartItems) {
            const book = item.Books;
            if (!book || book.status !== 'active') {
                throw { status: 400, message: `Sản phẩm "${book?.title || 'Unknown'}" không khả dụng` };
            }
            if (book.stock < (item.quantity || 0)) {
                throw { status: 400, message: `Sản phẩm "${book.title}" chỉ còn ${book.stock} trong kho` };
            }
            const salePrice = book.sale_price ? Number(book.sale_price) : 0;
            const price = Number(book.price);
            const finalPrice = salePrice > 0 ? salePrice : price;
            const qty = item.quantity || 0;
            total += finalPrice * qty;
            orderItemsData.push({
                book_id: book.id,
                quantity: qty,
                price: finalPrice,
            });
        }
        // 3. Create order
        const order = await tx.orders.create({
            data: {
                user_id: userId,
                address_id: addressId,
                total,
                status: 'pending',
            },
        });
        // 4. Create order items
        await tx.orderItems.createMany({
            data: orderItemsData.map((item) => ({
                order_id: order.id,
                book_id: item.book_id,
                quantity: item.quantity,
                price: item.price,
            })),
        });
        // 5. Create payment record
        await tx.payments.create({
            data: {
                order_id: order.id,
                method: paymentMethod,
                status: 'pending',
            },
        });
        // 6. Decrement stock and increment sold
        for (const item of orderItemsData) {
            await tx.books.update({
                where: { id: item.book_id },
                data: {
                    stock: { decrement: item.quantity },
                    sold: { increment: item.quantity },
                },
            });
        }
        // 7. Clear cart
        await tx.cartItems.deleteMany({ where: { cart_id: cart.id } });
        // 8. Return order with details
        return await tx.orders.findUnique({
            where: { id: order.id },
            include: {
                OrderItems: {
                    include: {
                        Books: {
                            select: { id: true, title: true, slug: true },
                        },
                    },
                },
                Addresses: true,
                Payments: true,
            },
        });
    });
};
exports.placeOrder = placeOrder;
// Get user addresses for checkout form
const getUserAddresses = async (userId) => {
    return await prisma_js_1.default.addresses.findMany({
        where: { user_id: userId },
        include: {
            Provinces: { select: { name: true } },
            Districts: { select: { name: true } },
            Wards: { select: { name: true } },
        },
    });
};
exports.getUserAddresses = getUserAddresses;
