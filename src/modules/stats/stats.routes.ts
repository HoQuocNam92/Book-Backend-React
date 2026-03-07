import express from 'express';
const router = express.Router();
import * as statsControllers from './stats.controllers.js';
import authorization from '../../middlewares/auth/authorization.js';

router.get('/overview', authorization, statsControllers.getOverviewStats);
router.get('/revenue', authorization, statsControllers.getRevenueStats);

export default router;
