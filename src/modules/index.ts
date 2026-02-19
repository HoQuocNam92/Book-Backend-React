import authRoute from './auth/auth.routes';
import productsRoute from './products/product.routes';
import brandsRoute from './brands/brand.routes';
import categoriesRouter from './categories/category.routes';

import express from 'express';
const router = express.Router();


router.use('/products', productsRoute)
router.use('/auth', authRoute);
router.use('/brands', brandsRoute)
router.use('/categories', categoriesRouter);


export default router;
