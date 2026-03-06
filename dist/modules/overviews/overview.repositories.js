"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueByYear = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getRevenueByYear = async (year) => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);
    const result = await prisma_1.default.$queryRaw `
        SELECT 
            MONTH(created_at) AS month, 
            SUM(total) AS revenue 
        FROM orders 
        WHERE created_at >= ${startDate} AND created_at <= ${endDate}
        GROUP BY MONTH(created_at)
    `;
    const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, revenue: 0 }));
    result.forEach(({ month, revenue }) => {
        revenueByMonth[month - 1].revenue = revenue;
    });
    return revenueByMonth;
};
exports.getRevenueByYear = getRevenueByYear;
