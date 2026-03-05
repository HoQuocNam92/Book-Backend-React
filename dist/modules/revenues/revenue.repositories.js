"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueAll = exports.getYearlyRevenue = exports.getMonthlyRevenue = exports.getRevenueWeek = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const date_fns_1 = require("date-fns");
const getRevenueWeek = async (week, year) => {
    const firstDayOfYear = new Date(year, 0, 4);
    const startISOWeek = (0, date_fns_1.startOfISOWeek)(firstDayOfYear);
    const startWeekOfYear = (0, date_fns_1.addDays)(startISOWeek, (week - 1) * 7);
    const endWeekOfYear = (0, date_fns_1.addDays)(startWeekOfYear, 6);
    const result = await prisma_1.default.$queryRaw `
  select cast(created_at as date) as date, sum(total) as revenue from Orders where created_at >= ${startWeekOfYear} and created_at <= ${endWeekOfYear} and status = 'completed' group by cast(created_at as date) order by date
  `;
    const resultMap = new Map(result.map(item => [new Date(item.date).toDateString(), item.revenue]));
    const dayOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    return Array.from({ length: 7 }, (_, i) => {
        const currentDate = (0, date_fns_1.addDays)(startWeekOfYear, i);
        const keys = currentDate.toDateString();
        return {
            day: dayOfWeek[i],
            revenue: resultMap.get(keys) || 0
        };
    });
};
exports.getRevenueWeek = getRevenueWeek;
const getMonthlyRevenue = async (year, month) => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    const result = await prisma_1.default.$queryRaw `
        WITH Weeks AS (
            SELECT 1 AS week
            UNION ALL SELECT 2
            UNION ALL SELECT 3
            UNION ALL SELECT 4
        ),
        OrdersByWeek AS (
            SELECT 
                CASE 
                    WHEN DAY(created_at) BETWEEN 1 AND 7 THEN 1
                    WHEN DAY(created_at) BETWEEN 8 AND 14 THEN 2
                    WHEN DAY(created_at) BETWEEN 15 AND 21 THEN 3
                    ELSE 4
                END AS week,
                total
            FROM orders
            WHERE created_at >= ${startOfMonth}
              AND created_at <= ${endOfMonth}
              and status = 'completed'
        )
        SELECT 
            w.week,
            ISNULL(SUM(o.total), 0) AS revenue
        FROM Weeks w
        LEFT JOIN OrdersByWeek o ON w.week = o.week
        GROUP BY w.week
        ORDER BY w.week
    `;
    return result;
};
exports.getMonthlyRevenue = getMonthlyRevenue;
const getYearlyRevenue = async (year) => {
    const gte = new Date(year, 0, 1); // January 1st
    const lte = new Date(year, 11, 31, 23, 59, 59); // December 31st
    const result = await prisma_1.default.$queryRaw `
        SELECT 
            MONTH(created_at) AS month, 
            SUM(total) AS revenue 
        FROM orders 
        WHERE created_at >= ${gte} AND created_at <= ${lte} and status = 'completed'
        GROUP BY MONTH(created_at)
    `;
    const totalRevenue = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        label: `T${i + 1}`,
        revenue: 0,
    }));
    for (const order of result) {
        totalRevenue[order.month - 1].revenue += Number(order.revenue || 0);
    }
    return totalRevenue;
};
exports.getYearlyRevenue = getYearlyRevenue;
const getRevenueAll = async (year) => {
    const result = await prisma_1.default.$queryRaw `
        SELECT 
            MONTH(created_at) AS month, 
            SUM(total) AS revenue,
            COUNT(*) AS totalOrders
        FROM orders
        WHERE YEAR(created_at) = ${year} and status = 'completed'
        GROUP BY  MONTH(created_at)
        ORDER BY  MONTH(created_at)
    `;
    const status = await prisma_1.default.orders.groupBy({
        by: ['status'],
        _count: {
            status: true,
        }
    });
    const topProducts = await prisma_1.default.orderItems.groupBy({
        by: ['book_id'],
        _sum: {
            price: true,
            quantity: true,
        },
        take: 5,
        orderBy: {
            _sum: {
                quantity: 'desc',
            }
        },
        where: {
            Orders: {
                status: 'completed'
            }
        }
    });
    const products = await prisma_1.default.books.findMany({
        where: {
            id: {
                in: topProducts.map((p) => p.book_id).filter(Boolean)
            }
        },
        select: {
            id: true,
            title: true,
        }
    });
    const totalOrders = await prisma_1.default.orders.count();
    const totalRevenue = await prisma_1.default.orders.aggregate({
        _sum: {
            total: true,
        },
        where: {
            AND: [
                {
                    created_at: {
                        gte: new Date(year, 0, 1),
                        lte: new Date(year, 11, 31, 23, 59, 59),
                    },
                },
                {
                    status: 'completed',
                },
            ],
        },
    });
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        label: `T${i + 1}`,
        revenue: 0,
        totalOrders: 0,
    }));
    for (const order of result) {
        monthlyRevenue[order.month - 1].revenue = Number(order.revenue || 0);
        monthlyRevenue[order.month - 1].totalOrders = order.totalOrders;
    }
    const avgOrderValue = totalOrders > 0 ? (Number(totalRevenue._sum.total || 0) / totalOrders) : 0;
    const topProductsByQuantity = topProducts.map((item) => ({
        bookId: item.book_id,
        revenue: Number(item._sum.price || 0),
        quantity: item._sum.quantity || 0,
        title: products.find(p => p.id === item.book_id)?.title || "Unknown Product",
    }));
    const statusCounts = {};
    for (const s of status) {
        const key = (s.status || 'unknown').toLowerCase();
        statusCounts[key] = s._count.status || 0;
    }
    return { totalRevenue: totalRevenue._sum.total || 0, totalOrders, monthlyRevenue, year, avgOrderValue, topProducts: topProductsByQuantity, statusCounts };
};
exports.getRevenueAll = getRevenueAll;
