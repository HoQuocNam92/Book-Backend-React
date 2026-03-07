import express from 'express'
import * as productController from './product.controllers.js'
import { upload } from '../../utils/upload.js';
import redisClient from '../../utils/redis.js';
import authorization from '../../middlewares/auth/authorization.js';
const router = express.Router()

router.get('/', productController.getProducts);

router.get('/detail/:slug', productController.getProductBySlug);

router.get('/:category_slug', productController.getProductByCategory);


router.post('/', authorization, upload.array("images", 10), productController.createProduct);


router.put('/quickActions/:id', authorization, productController.updateProductQuickActions);

router.put('/:id', authorization, upload.array("images", 10), productController.updateProduct);
router.delete('/:id', authorization, productController.deleteProduct);




export default router;