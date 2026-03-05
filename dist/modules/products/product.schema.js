"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuickActionSchema = exports.deleteProductSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Tên sản phẩm không được để trống"),
    price: zod_1.z.coerce.number().min(0, "Giá phải >= 0"),
    sale_price: zod_1.z.coerce.number().min(0, "Giá phải >= 0").default(0),
    stock: zod_1.z.coerce.number().int().min(0, "Số lượng phải >= 0"),
    description: zod_1.z.string(),
    content: zod_1.z.string().optional(),
    slug: zod_1.z.string().min(1, "Slug không được để trống").optional(),
    brand_id: zod_1.z.coerce.number().int("brand_id phải là số nguyên"),
    category_id: zod_1.z.coerce.number().int("category_id phải là số nguyên"),
    discount_percent: zod_1.z.coerce.number().min(0).max(100).default(0),
    status: zod_1.z.enum(["active", "draft", "archive"]).default("active"),
    is_featured: zod_1.z.string().transform((value) => value === "true").default(false),
    attri: zod_1.z
        .array(zod_1.z.object({
        key: zod_1.z.string().min(1, "Key không được trống"),
        value: zod_1.z.string().min(1, "Value không được trống"),
    }))
        .optional(),
});
exports.deleteProductSchema = zod_1.z.object({
    id: zod_1.z.number().int(),
});
exports.productQuickActionSchema = zod_1.z.object({
    status: zod_1.z.enum(["active", "draft", "archive"]).optional(),
    is_featured: zod_1.z.boolean().optional(),
});
