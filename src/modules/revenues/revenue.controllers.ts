import { NextFunction, Request, Response } from "express";
import * as revenueServices from "./revenue.services.js";

export const getRevenueWeek = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const week = parseInt(req.query.week as string) || 1;
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        const result = await revenueServices.getRevenueWeek(week, year);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

export const getMonthlyRevenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
        const result = await revenueServices.getMonthlyRevenue(year, month);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

export const getYearlyRevenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        const result = await revenueServices.getYearlyRevenue(year);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
export const getRevenueAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const year = parseInt(req.query.year as string) || new Date().getFullYear();
        const {
            totalRevenue,
            totalOrders,
            monthlyRevenue,
            avgOrderValue,
            topProducts,
            statusCounts,


        } = await revenueServices.getRevenueAll(year);
        return res.json({ message: "Lấy dữ liệu doanh thu thành công", totalRevenue, totalOrders, monthlyRevenue, avgOrderValue, topProducts, statusCounts, year });
    }
    catch (error) {
        next(error);
    }
} 