import prisma from '../../utils/prisma.js';
export const getOverviewStats = async (req, res, next) => {
    try {
        const [totalUsers, totalOrders, totalProducts, totalBrands, totalCategories, recentOrders] = await Promise.all([
            prisma.users.count(),
            prisma.orders.count(),
            prisma.books.count(),
            prisma.brands.count(),
            prisma.categories.count(),
            prisma.orders.findMany({
                take: 10,
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
            }),
        ]);
        const totalRevenue = await prisma.orders.aggregate({
            _sum: { total: true },
        });
        res.status(200).json({
            message: 'Lấy thống kê thành công',
            data: {
                totalUsers,
                totalOrders,
                totalProducts,
                totalBrands,
                totalCategories,
                totalRevenue: totalRevenue._sum.total || 0,
                recentOrders: recentOrders.map((o) => ({
                    id: o.id,
                    customer: o.Users?.name || 'N/A',
                    total: o.total,
                    status: o.status,
                    items: o.OrderItems.length,
                    createdAt: o.created_at,
                })),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
