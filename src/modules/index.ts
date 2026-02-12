import authRoute from './auth/auth.routes';
import productsRoute from './products/product.routes';
import express from 'express';
const router = express.Router();


router.use('/products', productsRoute)
router.use('/auth', authRoute);

export default router;
