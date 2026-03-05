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
const couponService = __importStar(require("./coupon.services"));
const coupon_schema_1 = require("./coupon.schema");
const createCoupon = async (req, res) => {
    try {
        const parsed = coupon_schema_1.CouponCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
        }
        const { code, discount, expired_at } = parsed.data;
        const coupon = await couponService.createCoupon({
            code,
            discount,
            expired_at: new Date(expired_at)
        });
        res.status(201).json({ success: true, message: 'Coupon created successfully', data: coupon });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createCoupon = createCoupon;
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await couponService.getAllCoupons();
        res.status(200).json({ success: true, message: 'Get all coupons successfully', data: coupons });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllCoupons = getAllCoupons;
const getCouponById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const coupon = await couponService.getCouponById(id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        res.status(200).json({ success: true, message: 'Get coupon successfully', data: coupon });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCouponById = getCouponById;
const updateCoupon = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const parsed = coupon_schema_1.CouponUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
        }
        const dataToUpdate = {};
        if (parsed.data.code)
            dataToUpdate.code = parsed.data.code;
        if (parsed.data.discount)
            dataToUpdate.discount = parsed.data.discount;
        if (parsed.data.expired_at)
            dataToUpdate.expired_at = new Date(parsed.data.expired_at);
        const coupon = await couponService.updateCoupon(id, dataToUpdate);
        res.status(200).json({ success: true, message: 'Coupon updated successfully', data: coupon });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateCoupon = updateCoupon;
const deleteCoupon = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await couponService.deleteCoupon(id);
        res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.deleteCoupon = deleteCoupon;
