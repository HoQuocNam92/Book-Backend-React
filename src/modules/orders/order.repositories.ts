import prisma from '../../utils/prisma';

export const getAllOrders = async () => {
    return await prisma.orders.findMany({
        select: {
            id: true,
            total: true,
            status: true,
            created_at: true,
            Users: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            Addresses: {
                select: {
                    address: true,
                    city: true,
                    phone: true,
                },
            },
            OrderItems: {
                select: {
                    id: true,
                    quantity: true,
                    price: true,
                    Books: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                },
            },
        },
        orderBy: { created_at: 'desc' },
    });
};

export const getOrderById = async (id: number) => {
    return await prisma.orders.findUnique({
        where: { id },
        include: {
            Users: {
                select: { id: true, name: true, email: true },
            },
            Addresses: true,
            OrderItems: {
                include: {
                    Books: {
                        select: { id: true, title: true, slug: true },
                    },
                },
            },
            Payments: true,
        },
    });
};

export const updateOrderStatus = async (id: number, status: string) => {
    return await prisma.orders.update({
        where: { id },
        data: { status },
    });
};

export const deleteOrder = async (id: number) => {
    return await prisma.orders.delete({
        where: { id },
    });
};

export const countOrders = async () => {
    return await prisma.orders.count();
};

export const getOrdersByUserId = async (userId: number) => {
    return await prisma.orders.findMany({
        where: { user_id: userId },
        select: {
            id: true,
            total: true,
            status: true,
            created_at: true,
            Addresses: {
                select: {
                    address: true,
                    phone: true,
                    Provinces: { select: { name: true } },
                    Districts: { select: { name: true } },
                    Wards: { select: { name: true } },
                },
            },
            OrderItems: {
                select: {
                    id: true,
                    quantity: true,
                    price: true,
                    Books: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            BookImages: {
                                select: { url: true },
                                take: 1,
                            },
                        },
                    },
                },
            },
            Payments: { select: { method: true, status: true } },
        },
        orderBy: { created_at: 'desc' },
    });
};

export const getRecentOrders = async (limit = 10) => {
    return await prisma.orders.findMany({
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
            id: true,
            total: true,
            status: true,
            created_at: true,
            Users: {
                select: { name: true },
            },
            OrderItems: {
                select: { id: true },
            },
        },
    });
};
