import express from 'express';




import * as reviewControllers from './review.controllers';

const router = express.Router();

router.post('/', reviewControllers.createReview);
router.get('/book/:book_id', reviewControllers.getReviewsByBookId);
export default router;