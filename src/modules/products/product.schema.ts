import { z } from "zod";

export const productSchema = z.object({
    title: z.string().min(1, "Tên sản phẩm không được để trống"),

    price: z.coerce.number().min(0, "Giá phải >= 0"),
    sale_price: z.coerce.number().min(0, "Giá phải >= 0").default(0),
    stock: z.coerce.number().int().min(0, "Số lượng phải >= 0"),

    description: z.string(),
    content: z.string().optional(),

    slug: z.string().min(1, "Slug không được để trống").optional(),

    brand_id: z.coerce.number().int("brand_id phải là số nguyên"),
    category_id: z.coerce.number().int("category_id phải là số nguyên"),

    discount_percent: z.coerce.number().min(0).max(100).default(0),

    status: z.enum(["active", "draft", "archive"]).default("active"),




    attri: z
        .array(
            z.object({
                key: z.string().min(1, "Key không được trống"),
                value: z.string().min(1, "Value không được trống"),
            })
        )
        .optional(),
});


export type productInput = z.infer<typeof productSchema>


export const deleteProductSchema = z.object({
    id: z.number().int(),
})

export type deleteProductInput = z.infer<typeof deleteProductSchema>

