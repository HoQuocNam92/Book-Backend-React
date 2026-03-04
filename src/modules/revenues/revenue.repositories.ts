import prisma from "../../utils/prisma";

import { startOfISOWeek, addDays, add } from "date-fns";

export const getRevenueWeek = async (week: number, year: number) => {
    const firstDayOfYear = new Date(year, 0, 4)
    const startISOWeek = startOfISOWeek(firstDayOfYear);

    const startWeekOfYear = addDays(startISOWeek, (week - 1) * 7);
    const endWeekOfYear = addDays(startWeekOfYear, 6);

    const result = await prisma.$queryRaw<{ date: Date, revenue: number }[]>
        `
  select cast(created_at as date) as date, sum(total) as revenue from Orders where created_at >= ${startWeekOfYear} and created_at <= ${endWeekOfYear} and status = 'completed' group by cast(created_at as date) order by date
  `
    const resultMap = new Map(result.map(item => [new Date(item.date).toDateString(), item.revenue]));

    const dayOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    return Array.from({ length: 7 }, (_, i) => {
        const currentDate = addDays(startWeekOfYear, i);
        const keys = currentDate.toDateString();
        return {
            day: dayOfWeek[i],
            revenue: resultMap.get(keys) || 0
        }
    })

};
export const getMonthlyRevenue = async (year: number, month: number) => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const result = await prisma.$queryRaw<
        { week: number; revenue: number }[]
    >`
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
export const getYearlyRevenue = async (year: number) => {
    const gte = new Date(year, 0, 1); // January 1st
    const lte = new Date(year, 11, 31, 23, 59, 59); // December 31st

    const result = await prisma.$queryRaw<{ month: number, revenue: number }[]>`
        SELECT 
            MONTH(created_at) AS month, 
            SUM(total) AS revenue 
        FROM orders 
        WHERE created_at >= ${gte} AND created_at <= ${lte} and status = 'completed'
        GROUP BY MONTH(created_at)
    `

    const totalRevenue = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        label: `T${i + 1}`,
        revenue: 0,
    }));

    for (const order of result) {
        totalRevenue[order.month - 1].revenue += Number(order.revenue || 0);
    }

    return totalRevenue;


}

export const getRevenueAll = async (year: number) => {
    const result = await prisma.$queryRaw<{ month: number, totalOrders: number, revenue: number }[]>`
        SELECT 
            MONTH(created_at) AS month, 
            SUM(total) AS revenue,
            COUNT(*) AS totalOrders
        FROM orders
        WHERE YEAR(created_at) = ${year} and status = 'completed'
        GROUP BY  MONTH(created_at)
        ORDER BY  MONTH(created_at)
    `;
    const status = await prisma.orders.groupBy({
        by: ['status'],
        _count: {
            status: true,
        }
    })
    const topProducts = await prisma.orderItems.groupBy({
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
    })
    const products = await prisma.books.findMany({
        where: {
            id: {
                in: topProducts.map((p: any) => p.book_id).filter(Boolean) as number[]
            }
        },
        select: {
            id: true,
            title: true,
        }
    })
    const totalOrders = await prisma.orders.count();
    const totalRevenue = await prisma.orders.aggregate({
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
    const topProductsByQuantity = topProducts.map((item: any) => ({
        bookId: item.book_id,
        revenue: Number(item._sum.price || 0),
        quantity: item._sum.quantity || 0,
        title: products.find(p => p.id === item.book_id)?.title || "Unknown Product",
    }))
    const statusCounts: Record<string, number> = {};
    for (const s of status) {
        const key = (s.status || 'unknown').toLowerCase();
        statusCounts[key] = s._count.status || 0;
    }

    return { totalRevenue: totalRevenue._sum.total || 0, totalOrders, monthlyRevenue, year, avgOrderValue, topProducts: topProductsByQuantity, statusCounts };
}