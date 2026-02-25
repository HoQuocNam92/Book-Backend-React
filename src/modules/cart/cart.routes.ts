import express from 'express';
import authentication from '../../middlewares/auth/authentication';
import * as cartControllers from './cart.controllers';

const router = express.Router();

router.use(authentication);

router.get('/', cartControllers.getCart);
router.get('/count', cartControllers.getCartItemCount);
router.post('/items', cartControllers.addToCart);
router.put('/items/:id', cartControllers.updateCartItemQty);
router.delete('/items/:id', cartControllers.removeCartItem);
router.delete('/', cartControllers.clearCart);

export default router;
