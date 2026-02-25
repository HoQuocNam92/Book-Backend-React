import authRoute from './auth/auth.routes';
import productsRoute from './products/product.routes';
import brandsRoute from './brands/brand.routes';
import categoriesRouter from './categories/category.routes';
import usersRoute from './users/user.routes';
import ordersRoute from './orders/order.routes';
import statsRoute from './stats/stats.routes';
import cartRoute from './cart/cart.routes';
import checkoutRoute from './checkout/checkout.routes';
import addressesRoute from './addresses/address.routes';

import express from 'express';
const router = express.Router();


router.use('/products', productsRoute)
router.use('/auth', authRoute);
router.use('/brands', brandsRoute)
router.use('/categories', categoriesRouter);
router.use('/users', usersRoute);
router.use('/orders', ordersRoute);
router.use('/stats', statsRoute);
router.use('/cart', cartRoute);
router.use('/checkout', checkoutRoute);
router.use('/addresses', addressesRoute);


export default router;
