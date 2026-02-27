import express from 'express';
import webhook from './webhook.config';
const router = express.Router();

router.post('/', webhook);

export default router;