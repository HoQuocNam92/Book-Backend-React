import express from 'express'
import * as productController from './product.controllers'
import { upload } from '../../utils/upload';
const router = express.Router()

router.get('/', productController.getProducts);

router.get('/:category_slug', productController.getProductByCategory);
router.post('/', upload.array("images", 10), productController.createProduct);

router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);




export default router;