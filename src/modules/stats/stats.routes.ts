import express from 'express';
const router = express.Router();
import * as statsControllers from './stats.controllers.js';

router.get('/overview', statsControllers.getOverviewStats);
router.get('/revenue', statsControllers.getRevenueStats);

export default router;
