import prisma from '../../utils/prisma.js';

// Place order from cart
export const placeOrder = async (
    userId: number,
    addressId: number,
    paymentMethod: string,
    coupon_id?: number,
    max_discount?: number
) => {
    return await prisma.$transaction(async (tx: any) => {
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
            throw new Error("CART_EMPTY");
        }

        // 2. Validate stock and calculate total
        let total = 0;
        const orderItemsData: { book_id: number; quantity: number; price: number }[] = [];

        for (const item of cart.CartItems) {
            const book = item.Books;
            if (!book || book.status !== 'active') {
                throw new Error("BOOK_UNAVAILABLE")
            }
            if (book.stock < (item.quantity || 0)) {
                throw new Error("INSUFFICIENT_STOCK")
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
                total: max_discount ? total - max_discount : total,
                status: 'pending',
                coupon_id: coupon_id
            },
        });
        if (coupon_id) {
            await tx.coupons.update({
                data: {
                    usage_count: 1
                },
                where: {
                    id: coupon_id
                }
            })
        }

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
                            select: { title: true },
                        },
                    },
                },
                Addresses: { select: { address: true } },
                Payments: { select: { method: true, status: true } },
                Users: {
                    select: {
                        name: true, email: true,
                        UserProfile: {
                            select: { Phone: true }
                        }
                    },

                }
            },
        });
    });
};

// Get user addresses for checkout form
export const getUserAddresses = async (userId: number) => {
    return await prisma.addresses.findMany({
        where: { user_id: userId },
        include: {
            Provinces: { select: { name: true } },
            Districts: { select: { name: true } },
            Wards: { select: { name: true } },
        },
    });
};
