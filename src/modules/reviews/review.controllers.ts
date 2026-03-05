import { NextFunction, Request, Response } from 'express';
import * as reviewServices from './review.services';


export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const review = await reviewServices.createReview(req.body);
        res.status(201).json({ message: "Tạo đánh giá thành công", data: review });
    } catch (error) {
        next(error);
    }
}


export const getReviewsByBookId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book_id = parseInt(req.params.book_id as string);
        const reviews = await reviewServices.getReviewsByBookId(book_id);
        res.status(200).json({ message: "Lấy đánh giá thành công", data: reviews });
    } catch (error) {
        next(error);
    }
}