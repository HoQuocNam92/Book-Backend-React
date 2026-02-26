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
exports.deleteOrder = exports.getMyOrders = exports.updateOrderStatus = exports.getOrderById = exports.getAllOrders = void 0;
const orderRepo = __importStar(require("./order.repositories.js"));
const getAllOrders = async () => {
    return await orderRepo.getAllOrders();
};
exports.getAllOrders = getAllOrders;
const getOrderById = async (id) => {
    const order = await orderRepo.getOrderById(id);
    if (!order) {
        throw { status: 404, message: 'Không tìm thấy đơn hàng' };
    }
    return order;
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (id, status) => {
    const validStatuses = ['pending', 'paid', 'shipping', 'completed', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
        throw { status: 400, message: 'Trạng thái không hợp lệ' };
    }
    const order = await orderRepo.getOrderById(id);
    if (!order) {
        throw { status: 404, message: 'Không tìm thấy đơn hàng' };
    }
    return await orderRepo.updateOrderStatus(id, status);
};
exports.updateOrderStatus = updateOrderStatus;
const getMyOrders = async (userId) => {
    return await orderRepo.getOrdersByUserId(userId);
};
exports.getMyOrders = getMyOrders;
const deleteOrder = async (id) => {
    const order = await orderRepo.getOrderById(id);
    if (!order) {
        throw { status: 404, message: 'Không tìm thấy đơn hàng' };
    }
    return await orderRepo.deleteOrder(id);
};
exports.deleteOrder = deleteOrder;
