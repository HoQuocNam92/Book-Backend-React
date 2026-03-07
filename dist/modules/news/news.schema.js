"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsSchema = void 0;
const zod_1 = require("zod");
exports.newsSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    title: zod_1.z.string().min(1, "Tiêu đề không được để trống"),
    slug: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    thumbnail: zod_1.z.instanceof(File).optional().nullable(),
    content: zod_1.z.string().optional(),
    is_published: zod_1.z.coerce.boolean().optional()
});
