"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.getCouponById = exports.getAllCoupons = exports.createCoupon = void 0;
const couponRepository = __importStar(require("./coupon.repositories"));
const createCoupon = async (data) => {
    const existingCoupon = await couponRepository.getCouponByCode(data.code);
    if (existingCoupon) {
        throw new Error('Coupon code already exists');
    }
    return await couponRepository.createCoupon(data);
};
exports.createCoupon = createCoupon;
const getAllCoupons = async () => {
    return await couponRepository.getAllCoupons();
};
exports.getAllCoupons = getAllCoupons;
const getCouponById = async (id) => {
    return await couponRepository.getCouponById(id);
};
exports.getCouponById = getCouponById;
const updateCoupon = async (id, data) => {
    const existingCoupon = await couponRepository.getCouponById(id);
    if (!existingCoupon) {
        throw new Error('Coupon not found');
    }
    if (data.code && data.code !== existingCoupon.code) {
        const checkCode = await couponRepository.getCouponByCode(data.code);
        if (checkCode) {
            throw new Error('Coupon code already exists');
        }
    }
    return await couponRepository.updateCoupon(id, data);
};
exports.updateCoupon = updateCoupon;
const deleteCoupon = async (id) => {
    const existingCoupon = await couponRepository.getCouponById(id);
    if (!existingCoupon) {
        throw new Error('Coupon not found');
    }
    return await couponRepository.deleteCoupon(id);
};
exports.deleteCoupon = deleteCoupon;
