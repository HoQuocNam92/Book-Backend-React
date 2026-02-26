"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySchema = void 0;
const zod_1 = require("zod");
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Vui lòng nhập tên danh mục"),
    parent_id: zod_1.z.coerce.number().optional().nullable(),
});
