"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.getCouponByCode = exports.getCouponById = exports.getAllCoupons = exports.createCoupon = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCoupon = async (data) => {
    return await prisma.coupons.create({
        data
    });
};
exports.createCoupon = createCoupon;
const getAllCoupons = async () => {
    return await prisma.coupons.findMany({
        orderBy: { id: 'desc' }
    });
};
exports.getAllCoupons = getAllCoupons;
const getCouponById = async (id) => {
    return await prisma.coupons.findUnique({
        where: { id }
    });
};
exports.getCouponById = getCouponById;
const getCouponByCode = async (code) => {
    return await prisma.coupons.findUnique({
        where: { code }
    });
};
exports.getCouponByCode = getCouponByCode;
const updateCoupon = async (id, data) => {
    return await prisma.coupons.update({
        where: { id },
        data
    });
};
exports.updateCoupon = updateCoupon;
const deleteCoupon = async (id) => {
    return await prisma.coupons.delete({
        where: { id }
    });
};
exports.deleteCoupon = deleteCoupon;
