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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartItemCount = exports.clearCart = exports.removeCartItem = exports.updateCartItemQty = exports.addToCart = exports.getCart = void 0;
const cartRepo = __importStar(require("./cart.repositories.js"));
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const getCart = async (userId) => {
    return await cartRepo.getCartByUserId(userId);
};
exports.getCart = getCart;
const addToCart = async (userId, input) => {
    const { book_id: bookId, quantity } = input;
    const book = await prisma_js_1.default.books.findUnique({ where: { id: bookId } });
    if (!book) {
        throw { status: 404, message: 'Không tìm thấy sản phẩm' };
    }
    if (book.status !== 'active') {
        throw { status: 400, message: 'Sản phẩm không khả dụng' };
    }
    if (book.stock < quantity) {
        throw { status: 400, message: `Chỉ còn ${book.stock} sản phẩm trong kho` };
    }
    return await cartRepo.addItemToCart(userId, bookId, quantity);
};
exports.addToCart = addToCart;
const updateCartItemQty = async (userId, cartItemId, quantity) => {
    const cartItem = await prisma_js_1.default.cartItems.findUnique({
        where: { id: cartItemId },
        include: {
            Carts: {
                select: {
                    user_id: true
                }
            }
        }
    });
    if (!cartItem || cartItem.Carts.user_id !== userId) {
        throw { status: 404, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };
    }
    return await cartRepo.updateCartItemQty(userId, cartItemId, quantity);
};
exports.updateCartItemQty = updateCartItemQty;
const removeCartItem = async (userId, cartItemId) => {
    return await cartRepo.removeCartItem(userId, cartItemId);
};
exports.removeCartItem = removeCartItem;
const clearCart = async (userId) => {
    return await cartRepo.clearCart(userId);
};
exports.clearCart = clearCart;
const getCartItemCount = async (userId) => {
    return await cartRepo.getCartItemCount(userId);
};
exports.getCartItemCount = getCartItemCount;
