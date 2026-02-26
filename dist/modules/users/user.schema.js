"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileSchema = void 0;
const zod_1 = require("zod");
exports.userProfileSchema = zod_1.z.object({
    name: zod_1.z.string("Tên không được để trống"),
    phone: zod_1.z.string().optional(),
    gender: zod_1.z.string().optional(),
    birth: zod_1.z.string().optional(),
});
