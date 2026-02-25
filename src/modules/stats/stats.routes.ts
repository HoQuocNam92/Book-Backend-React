import express from 'express';
const router = express.Router();
import * as statsControllers from './stats.controllers';

router.get('/overview', statsControllers.getOverviewStats);

export default router;
