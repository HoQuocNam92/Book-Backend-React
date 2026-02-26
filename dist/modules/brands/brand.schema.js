"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandSchema = void 0;
const zod_1 = require("zod");
exports.brandSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Vui lòng nhập tên'),
    slug: zod_1.z.string().min(1, 'Vui lòng nhập slug').optional(),
    description: zod_1.z.string().optional(),
    logo_url: zod_1.z.string().optional(),
});
