import express from 'express';

import * as relatedController from './related.controllers.js';

const router = express.Router();
router.get('/:id', relatedController.getProductRelated);
export default router;