import prisma from "../../utils/prisma";
import { CreateReviewInput } from "./review.schema";


export const createReview = async (data: CreateReviewInput) => {
    const review = await prisma.reviews.create({
        data: {
            book_id: data.bookId,
            user_id: data.userId,
            rating: data.rating,
            comment: data.comment,
        },
    });
    return review;
}


export const getReviewsByBookId = async (book_id: number) => {
    const reviews = await prisma.reviews.findMany({
        where: { book_id },
        include: {
            Users: {
                select: {
                    id: true,
                    name: true,
                    UserProfile: {
                        select: {
                            avatar: true,
                        }
                    }
                },


            },

        },
    });
    return reviews;
}
