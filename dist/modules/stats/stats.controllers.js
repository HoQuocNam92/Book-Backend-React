"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueStats = exports.getOverviewStats = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const getOverviewStats = async (req, res, next) => {
    try {
        const [totalUsers, totalOrders, totalProducts, totalBrands, totalCategories, recentOrders] = await Promise.all([
            prisma_js_1.default.users.count(),
            prisma_js_1.default.orders.count(),
            prisma_js_1.default.books.count(),
            prisma_js_1.default.brands.count(),
            prisma_js_1.default.categories.count(),
            prisma_js_1.default.orders.findMany({
                take: 10,
                orderBy: { created_at: 'desc' },
                select: {
                    id: true,
                    total: true,
                    status: true,
                    created_at: true,
                    Users: { select: { name: true } },
                    OrderItems: { select: { id: true } },
                },
            }),
        ]);
        const totalRevenue = await prisma_js_1.default.orders.aggregate({ _sum: { total: true } });
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
exports.getOverviewStats = getOverviewStats;
const getRevenueStats = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const orders = await prisma_js_1.default.orders.findMany({
            where: {
                created_at: {
                    gte: new Date(`${year}-01-01`),
                    lte: new Date(`${year}-12-31T23:59:59`),
                },
            },
            select: { id: true, total: true, status: true, created_at: true },
        });
        // Monthly breakdown
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            label: `T${i + 1}`,
            revenue: 0,
            orders: 0,
        }));
        for (const order of orders) {
            if (!order.created_at)
                continue;
            const m = new Date(order.created_at).getMonth();
            monthlyRevenue[m].revenue += Number(order.total || 0);
            monthlyRevenue[m].orders += 1;
        }
        // Order status distribution
        const statusCounts = {};
        for (const order of orders) {
            const s = (order.status || 'unknown').toLowerCase();
            statusCounts[s] = (statusCounts[s] || 0) + 1;
        }
        console.log("Order status counts:", statusCounts);
        // Top 5 products by revenue for the year
        const topItems = await prisma_js_1.default.orderItems.groupBy({
            by: ['book_id'],
            _sum: { price: true, quantity: true },
            orderBy: { _sum: { price: 'desc' } },
            take: 5,
        });
        const bookIds = topItems.map((i) => i.book_id).filter(Boolean);
        const books = await prisma_js_1.default.books.findMany({
            where: { id: { in: bookIds } },
            select: { id: true, title: true },
        });
        const bookMap = Object.fromEntries(books.map((b) => [b.id, b.title]));
        const topProducts = topItems.map((item) => ({
            bookId: item.book_id,
            title: bookMap[item.book_id] || '—',
            revenue: Number(item._sum.price || 0),
            quantity: item._sum.quantity || 0,
        }));
        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        res.status(200).json({
            message: 'Lấy doanh thu thành công',
            data: { year, totalRevenue, totalOrders, avgOrderValue, monthlyRevenue, statusCounts, topProducts },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRevenueStats = getRevenueStats;
