import express from 'express'

const router = express.Router();

import authRoute from '#/modules/auth/auth.routes.js'

router.post('/auth', authRoute);

export default router;
