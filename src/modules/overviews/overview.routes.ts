import express from 'express';
const router = express.Router();

import getChartDataRoute from './overview.controllers';
import authorization from '../../middlewares/auth/authorization';

router.use(authorization)
router.get('/chart-data', getChartDataRoute);
export default router;