"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerSchema = exports.BannerTypeEnum = void 0;
const zod_1 = require("zod");
exports.BannerTypeEnum = zod_1.z.enum(['sales', 'featured', 'new']);
exports.BannerSchema = zod_1.z.object({
    link_url: zod_1.z.string("Vui lòng nhập URL hợp lệ").url(),
    type: exports.BannerTypeEnum.default('sales'),
});
