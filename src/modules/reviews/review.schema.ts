import { z } from 'zod'

export const createReviewSchema = z.object({
    bookId: z.number("Book ID phải là một số"),
    userId: z.number("Vui lòng đăng nhập để bình luận"),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
})


export type CreateReviewInput = z.infer<typeof createReviewSchema>