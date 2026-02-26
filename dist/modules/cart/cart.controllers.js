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
exports.getCartItemCount = exports.clearCart = exports.removeCartItem = exports.updateCartItemQty = exports.addToCart = exports.getCart = void 0;
const cartServices = __importStar(require("./cart.services.js"));
const cart_schema_js_1 = require("./cart.schema.js");
const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cart = await cartServices.getCart(userId);
        res.status(200).json({ message: 'Lấy giỏ hàng thành công', data: cart });
    }
    catch (error) {
        next(error);
    }
};
exports.getCart = getCart;
const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { book_id, quantity } = req.body;
        const validateInput = cart_schema_js_1.AddToCartSchema.parse({ book_id, quantity });
        const cart = await cartServices.addToCart(userId, validateInput);
        res.status(200).json({ message: 'Thêm vào giỏ hàng thành công', data: cart });
    }
    catch (error) {
        next(error);
    }
};
exports.addToCart = addToCart;
const updateCartItemQty = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cartItemId = parseInt(req.params.id);
        const { quantity } = req.body;
        const validateInput = cart_schema_js_1.UpdateCartItemQtySchema.parse({ quantity });
        if (isNaN(cartItemId)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const cart = await cartServices.updateCartItemQty(userId, cartItemId, validateInput.quantity);
        res.status(200).json({ message: 'Cập nhật số lượng thành công', data: cart });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCartItemQty = updateCartItemQty;
const removeCartItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cartItemId = parseInt(req.params.id);
        if (isNaN(cartItemId)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const cart = await cartServices.removeCartItem(userId, cartItemId);
        res.status(200).json({ message: 'Xóa sản phẩm thành công', data: cart });
    }
    catch (error) {
        next(error);
    }
};
exports.removeCartItem = removeCartItem;
const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cart = await cartServices.clearCart(userId);
        res.status(200).json({ message: 'Đã xóa toàn bộ giỏ hàng', data: cart });
    }
    catch (error) {
        next(error);
    }
};
exports.clearCart = clearCart;
const getCartItemCount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const count = await cartServices.getCartItemCount(userId);
        res.status(200).json({ data: count });
    }
    catch (error) {
        next(error);
    }
};
exports.getCartItemCount = getCartItemCount;
