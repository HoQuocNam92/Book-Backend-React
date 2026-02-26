import express from 'express';
import authentication from '../../middlewares/auth/authentication.js';
import * as checkoutControllers from './checkout.controllers.js';
const router = express.Router();
// All checkout routes require authentication
router.use(authentication);
router.post('/', checkoutControllers.placeOrder);
router.get('/addresses', checkoutControllers.getUserAddresses);
export default router;
