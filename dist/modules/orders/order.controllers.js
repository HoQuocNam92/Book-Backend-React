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
exports.deleteOrder = exports.updateOrderStatus = exports.getOrderById = exports.getAllOrders = exports.getMyOrders = void 0;
const orderServices = __importStar(require("./order.services.js"));
const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await orderServices.getMyOrders(userId);
        res.status(200).json({ message: 'Lấy đơn hàng của bạn thành công', data: orders });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyOrders = getMyOrders;
const getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { orders, totalPages } = await orderServices.getAllOrders(page);
        res.status(200).json({ message: 'Lấy danh sách đơn hàng thành công', data: orders, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllOrders = getAllOrders;
const getOrderById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const order = await orderServices.getOrderById(id);
        res.status(200).json({ message: 'Lấy đơn hàng thành công', data: order });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Vui lòng nhập trạng thái' });
        }
        const order = await orderServices.updateOrderStatus(id, status);
        res.status(200).json({ message: 'Cập nhật trạng thái thành công', data: order });
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrderStatus = updateOrderStatus;
const deleteOrder = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        await orderServices.deleteOrder(id);
        res.status(200).json({ message: 'Xóa đơn hàng thành công' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteOrder = deleteOrder;
