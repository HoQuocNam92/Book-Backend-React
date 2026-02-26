import { z } from 'zod';


export const AddToCartSchema = z.object({
    book_id: z.number("ID sách phải là một số"),
    quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
});

export const UpdateCartItemQtySchema = z.object({
    quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemQtyInput = z.infer<typeof UpdateCartItemQtySchema>;