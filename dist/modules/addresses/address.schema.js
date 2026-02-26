"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adddressSchema = void 0;
const zod_1 = require("zod");
exports.adddressSchema = zod_1.z.object({
    address: zod_1.z.string().min(1, "Địa chỉ không được để trống"),
    phone: zod_1.z.string().min(1, "Số điện thoại không được để trống").regex(/^\d+$/, "Số điện thoại phải là số"),
    province_code: zod_1.z.number().min(1, "ID tỉnh thành không được để trống"),
    district_code: zod_1.z.number().min(1, "ID quận/huyện không được để trống"),
    ward_code: zod_1.z.number().min(1, "ID phường/xã không được để trống"),
});
