"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCartItemQtySchema = exports.AddToCartSchema = void 0;
const zod_1 = require("zod");
exports.AddToCartSchema = zod_1.z.object({
    book_id: zod_1.z.number("ID sách phải là một số"),
    quantity: zod_1.z.number().min(1, "Số lượng phải lớn hơn 0"),
});
exports.UpdateCartItemQtySchema = zod_1.z.object({
    quantity: zod_1.z.number().min(1, "Số lượng phải lớn hơn 0"),
});
