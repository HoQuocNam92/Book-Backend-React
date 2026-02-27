import { getRevenueByYear } from "./overview.repositories"

export const getChartData = async (year: number) => {
    const revenueByMonth = await getRevenueByYear(year)
    return revenueByMonth
}