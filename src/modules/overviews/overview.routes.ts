import express from 'express';
const router = express.Router();

import getChartDataRoute from './overview.controllers';

router.get('/chart-data', getChartDataRoute);
export default router;