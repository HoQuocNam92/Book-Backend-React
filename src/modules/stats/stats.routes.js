import express from 'express';
const router = express.Router();
import * as statsControllers from './stats.controllers.js';
router.get('/overview', statsControllers.getOverviewStats);
export default router;
