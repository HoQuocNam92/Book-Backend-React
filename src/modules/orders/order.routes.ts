import express from 'express';
import authentication from '../../middlewares/auth/authentication.js';
import * as orderControllers from './order.controllers.js';
import authorization from '../../middlewares/auth/authorization.js';

const router = express.Router();

router.get('/my', authentication, orderControllers.getMyOrders);

router.get('/', authorization, orderControllers.getAllOrders);
router.get('/:id', authorization, orderControllers.getOrderById);
router.put('/:id/status', authorization, orderControllers.updateOrderStatus);
router.delete('/:id', authorization, orderControllers.deleteOrder);

export default router;
