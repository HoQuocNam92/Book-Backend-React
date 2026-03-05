"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartData = void 0;
const overview_repositories_1 = require("./overview.repositories");
const getChartData = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const revenueByMonth = await (0, overview_repositories_1.getRevenueByYear)(year);
        res.json(revenueByMonth);
    }
    catch (error) {
    }
};
exports.getChartData = getChartData;
exports.default = exports.getChartData;
