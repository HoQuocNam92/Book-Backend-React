import authRoute from './auth/auth.routes.js';
import productsRoute from './products/product.routes.js';
import brandsRoute from './brands/brand.routes.js';
import categoriesRouter from './categories/category.routes.js';
import usersRoute from './users/user.routes.js';
import ordersRoute from './orders/order.routes.js';
import statsRoute from './stats/stats.routes.js';
import cartRoute from './cart/cart.routes.js';
import checkoutRoute from './checkout/checkout.routes.js';
import addressesRoute from './addresses/address.routes.js';
import webhookRoute from './webhook/webhook.routes.js';
import overviewRoute from './overviews/overview.routes.js';
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
router.use('/telegram/webhook', webhookRoute);
router.use('/overviews', overviewRoute);

export default router;
