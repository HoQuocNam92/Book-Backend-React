import { NextFunction, Request, Response } from "express";
import { getRevenueByYear } from "./overview.repositories";



export const getChartData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const year = parseInt(req.query.year as string) || new Date().getFullYear()
        const revenueByMonth = await getRevenueByYear(year)
        res.json(revenueByMonth)
    } catch (error) {

    }
}
export default getChartData