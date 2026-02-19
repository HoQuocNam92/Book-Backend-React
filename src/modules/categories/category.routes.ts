import express from 'express';

const router = express.Router();
import * as categoryController from './category.controllers';


router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);


export default router;