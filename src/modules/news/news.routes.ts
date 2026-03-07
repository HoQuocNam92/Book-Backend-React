import express from 'express';
import * as newsControllers from './news.controllers.js';
import { upload } from '../../utils/upload.js';
import authorization from '../../middlewares/auth/authorization.js';

const router = express.Router();

router.get('/', newsControllers.getAllNews);
router.get('/published', newsControllers.getPublishedNews);
router.get('/:slug', newsControllers.getNewsBySlug);
router.post('/', authorization, upload.single('thumbnail'), newsControllers.createNews);
router.put('/:id', authorization, upload.single('thumbnail'), newsControllers.updateNews);
router.delete('/:id', authorization, newsControllers.deleteNews);

export default router;
