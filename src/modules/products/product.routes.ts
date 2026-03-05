import express from 'express'
import * as productController from './product.controllers.js'
import { upload } from '../../utils/upload.js';
import redisClient from '../../utils/redis.js';
const router = express.Router()

router.get('/', productController.getProducts);

router.get('/detail/:slug', productController.getProductBySlug);

router.get('/:category_slug', productController.getProductByCategory);
router.post('/', upload.array("images", 10), productController.createProduct);
router.put('/quickActions/:id', productController.updateProductQuickActions);

router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

router.post('/del', async (req, res) => {
    const keys = await redisClient.keys('products:*');
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
    return res.status(200).json({ message: 'Cache cleared successfully' });
})


export default router;