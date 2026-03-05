"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueAll = exports.getYearlyRevenue = exports.getMonthlyRevenue = exports.getRevenueWeek = void 0;
const revenueServices = __importStar(require("./revenue.services.js"));
const getRevenueWeek = async (req, res, next) => {
    try {
        const week = parseInt(req.query.week) || 1;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const result = await revenueServices.getRevenueWeek(week, year);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getRevenueWeek = getRevenueWeek;
const getMonthlyRevenue = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        const result = await revenueServices.getMonthlyRevenue(year, month);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getMonthlyRevenue = getMonthlyRevenue;
const getYearlyRevenue = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const result = await revenueServices.getYearlyRevenue(year);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getYearlyRevenue = getYearlyRevenue;
const getRevenueAll = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const { totalRevenue, totalOrders, monthlyRevenue, avgOrderValue, topProducts, statusCounts, } = await revenueServices.getRevenueAll(year);
        return res.json({ message: "Lấy dữ liệu doanh thu thành công", totalRevenue, totalOrders, monthlyRevenue, avgOrderValue, topProducts, statusCounts, year });
    }
    catch (error) {
        next(error);
    }
};
exports.getRevenueAll = getRevenueAll;
