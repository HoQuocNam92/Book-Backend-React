"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverviewStats = void 0;
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
                    Users: {
                        select: { name: true },
                    },
                    OrderItems: {
                        select: { id: true },
                    },
                },
            }),
        ]);
        const totalRevenue = await prisma_js_1.default.orders.aggregate({
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
exports.getOverviewStats = getOverviewStats;
