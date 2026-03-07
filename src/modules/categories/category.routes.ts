import express from 'express';

const router = express.Router();
import * as categoryController from './category.controllers.js';
import authorization from '../../middlewares/auth/authorization.js';


router.get('/', categoryController.getAllCategories);
router.post('/', authorization, categoryController.createCategory);
router.put('/:id', authorization, categoryController.updateCategory);
router.delete('/:id', authorization, categoryController.deleteCategory);


export default router;