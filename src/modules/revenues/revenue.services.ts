import * as revenueRepo from "./revenue.repositories";
export const getYearlyRevenue = async (year: number) => {
    return await revenueRepo.getYearlyRevenue(year);
}

export const getMonthlyRevenue = async (year: number, month: number) => {
    return await revenueRepo.getMonthlyRevenue(year, month);
}

export const getRevenueWeek = async (week: number, year: number) => {
    return await revenueRepo.getRevenueWeek(week, year);
}

export const getRevenueAll = async (year: number) => {
    return await revenueRepo.getRevenueAll(year);
}