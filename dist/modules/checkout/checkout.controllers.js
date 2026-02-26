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
exports.getUserAddresses = exports.placeOrder = void 0;
const checkoutServices = __importStar(require("./checkout.services.js"));
const placeOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { address_id, payment_method } = req.body;
        if (!address_id) {
            return res.status(400).json({ message: 'Vui lòng chọn địa chỉ giao hàng' });
        }
        const order = await checkoutServices.placeOrder(userId, Number(address_id), payment_method || 'cod');
        res.status(201).json({ message: 'Đặt hàng thành công', data: order });
    }
    catch (error) {
        next(error);
    }
};
exports.placeOrder = placeOrder;
const getUserAddresses = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const addresses = await checkoutServices.getUserAddresses(userId);
        res.status(200).json({ message: 'Lấy địa chỉ thành công', data: addresses });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserAddresses = getUserAddresses;
