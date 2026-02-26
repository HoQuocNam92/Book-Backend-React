import { z } from 'zod';
export const categorySchema = z.object({
    name: z.string().min(1, "Vui lòng nhập tên danh mục"),
    parent_id: z.coerce.number().optional().nullable(),
});
