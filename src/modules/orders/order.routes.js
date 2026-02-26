import express from 'express';
import authentication from '../../middlewares/auth/authentication.js';
import * as orderControllers from './order.controllers.js';
const router = express.Router();
// User's own orders (must be before /:id)
router.get('/my', authentication, orderControllers.getMyOrders);
router.get('/', orderControllers.getAllOrders);
router.get('/:id', orderControllers.getOrderById);
router.put('/:id/status', orderControllers.updateOrderStatus);
router.delete('/:id', orderControllers.deleteOrder);
export default router;
