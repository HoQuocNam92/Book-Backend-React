import prisma from '../../utils/prisma.js';

export const getCartByUserId = async (userId: number) => {
    let cart = await prisma.carts.findUnique({
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
        items: cart?.CartItems.map((item: any) => {
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

export const addItemToCart = async (userId: number, bookId: number, quantity: number) => {
    return await prisma.$transaction(async (tx) => {

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
            } else {
                await tx.cartItems.create({
                    data: {
                        cart_id: cart.id,
                        book_id: bookId,
                        quantity,
                    },
                });
            }
            return cart
        } catch (error) {
            throw new Error('ERROR_ADDING_TO_CART');
        }

    });
};

export const updateCartItemQty = async (userId: number, cartItemId: number, quantity: number) => {
    const cart = await prisma.carts.findUnique({ where: { user_id: userId } });
    if (!cart) throw new Error('NOT_FOUND_ITEMS_IN_CART');

    const item = await prisma.cartItems.findFirst({
        where: { id: cartItemId, cart_id: cart.id },
    });
    if (!item) throw new Error('NOT_FOUND_ITEMS_IN_CART');

    if (quantity <= 0) {
        await prisma.$transaction(async (tx) => {
            try {
                await tx.carts.delete({ where: { id: cart.id } });
                await tx.cartItems.delete({ where: { id: cartItemId } });
            } catch (error) {
                throw new Error('ERROR_DELETING_CART_ITEM');
            }
        });
    } else {
        await prisma.cartItems.update({
            where: { id: cartItemId },
            data: { quantity },
        });
    }

    return getCartByUserId(userId);
};

export const removeCartItem = async (userId: number, cartItemId: number) => {
    const cart = await prisma.carts.findUnique({ where: { user_id: userId } });
    if (!cart) throw new Error('NOT_FOUND_CART');

    const item = await prisma.cartItems.findFirst({
        where: { id: cartItemId, cart_id: cart.id },
    });
    if (!item) throw new Error('NOT_FOUND_ITEMS_IN_CART');

    await prisma.cartItems.delete({ where: { id: cartItemId } });
    return getCartByUserId(userId);
};

export const clearCart = async (userId: number) => {
    const cart = await prisma.carts.findUnique({ where: { user_id: userId } });
    if (!cart) return { id: 0, items: [] };

    await prisma.$transaction(async (tx) => {
        try {
            await tx.carts.deleteMany({ where: { id: cart.id } });
        } catch (error) {
            throw new Error('ERROR_CLEARING_CART');
        }
    })
    return { id: cart.id, items: [] };
};

export const getCartItemCount = async (userId: number) => {
    const cart = await prisma.carts.findUnique({ where: { user_id: userId } });
    if (!cart) return 0;

    const result = await prisma.cartItems.aggregate({
        where: { cart_id: cart.id },
        _sum: { quantity: true },
    });
    return result._sum.quantity || 0;
};
