"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    bookId: zod_1.z.number("Book ID phải là một số"),
    userId: zod_1.z.number("Vui lòng đăng nhập để bình luận"),
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().optional(),
});
