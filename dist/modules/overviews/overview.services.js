"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartData = void 0;
const overview_repositories_1 = require("./overview.repositories");
const getChartData = async (year) => {
    const revenueByMonth = await (0, overview_repositories_1.getRevenueByYear)(year);
    return revenueByMonth;
};
exports.getChartData = getChartData;
