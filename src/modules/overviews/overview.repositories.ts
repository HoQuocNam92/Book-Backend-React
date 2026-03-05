import prisma from '../../utils/prisma';



export const getRevenueByYear = async (year: number) => {
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31, 23, 59, 59)


    const result = await prisma.$queryRaw<{ month: number, revenue: number }[]>`
        SELECT 
            MONTH(created_at) AS month, 
            SUM(total) AS revenue 
        FROM orders 
        WHERE created_at >= ${startDate} AND created_at <= ${endDate}
        GROUP BY MONTH(created_at)
    `
    const revenueByMonth: { month: number, revenue: number }[] = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, revenue: 0 }))

    result.forEach(({ month, revenue }) => {
        revenueByMonth[month - 1].revenue = revenue
    })

    return revenueByMonth
}