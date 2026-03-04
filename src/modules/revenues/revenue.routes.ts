import express from 'express';
const router = express.Router();


import * as revenueControllers from './revenue.controllers.js';

router.get('/weekly', revenueControllers.getRevenueWeek);
router.get('/monthly', revenueControllers.getMonthlyRevenue);
router.get('/yearly', revenueControllers.getYearlyRevenue);
router.get('/', revenueControllers.getRevenueAll);
export default router;