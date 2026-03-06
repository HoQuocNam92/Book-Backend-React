import express from 'express';
import * as searchControllers from './search.controllers.js';

const router = express.Router();




router.get('/books', searchControllers.getSearchBooks);
router.get('/books-by-category', searchControllers.getSearchBookByCategory);
router.get('/categories', searchControllers.getSearchCategories);
router.get('/authors', searchControllers.getSearchAuthors);

export default router;