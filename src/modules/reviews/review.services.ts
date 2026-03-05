
import * as reviewRepository from './review.repositories';
import { CreateReviewInput } from './review.schema';



export const createReview = async (data: CreateReviewInput) => {
    const review = await reviewRepository.createReview(data);
    return review;
}

export const getReviewsByBookId = async (book_id: number) => {
    const reviews = await reviewRepository.getReviewsByBookId(book_id);
    return reviews;
}
