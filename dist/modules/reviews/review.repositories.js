"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsByBookId = exports.createReview = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createReview = async (data) => {
    const review = await prisma_1.default.reviews.create({
        data: {
            book_id: data.bookId,
            user_id: data.userId,
            rating: data.rating,
            comment: data.comment,
        },
    });
    return review;
};
exports.createReview = createReview;
const getReviewsByBookId = async (book_id) => {
    const reviews = await prisma_1.default.reviews.findMany({
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
};
exports.getReviewsByBookId = getReviewsByBookId;
