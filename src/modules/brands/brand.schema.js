import { z } from 'zod';
export const brandSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên'),
    slug: z.string().min(1, 'Vui lòng nhập slug').optional(),
    description: z.string().optional(),
    logo_url: z.string().optional(),
});
