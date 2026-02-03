import authRoute from './auth/auth.routes';
import express from 'express';
const router = express.Router();

router.use('/auth', authRoute);

export default router;
