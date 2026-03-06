import express from 'express';
import * as newsControllers from './news.controllers.js';
import { upload } from '../../utils/upload.js';

const router = express.Router();

router.get('/', newsControllers.getAllNews);
router.get('/published', newsControllers.getPublishedNews);
router.get('/:slug', newsControllers.getNewsBySlug);
router.post('/', upload.single('thumbnail'), newsControllers.createNews);
router.put('/:id', upload.single('thumbnail'), newsControllers.updateNews);
router.delete('/:id', newsControllers.deleteNews);

export default router;
