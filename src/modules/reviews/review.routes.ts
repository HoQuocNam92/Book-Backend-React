import express from 'express';




import * as reviewControllers from './review.controllers';
import authorization from '../../middlewares/auth/authorization';

const router = express.Router();

router.post('/', authorization, reviewControllers.createReview);
router.get('/book/:book_id', reviewControllers.getReviewsByBookId);
export default router;