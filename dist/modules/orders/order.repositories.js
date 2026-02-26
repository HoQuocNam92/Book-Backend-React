"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentOrders = exports.getOrdersByUserId = exports.countOrders = exports.deleteOrder = exports.updateOrderStatus = exports.getOrderById = exports.getAllOrders = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const getAllOrders = async () => {
    return await prisma_js_1.default.orders.findMany({
        select: {
            id: true,
            total: true,
            status: true,
            created_at: true,
            Users: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            Addresses: {
                select: {
                    address: true,
                    phone: true,
                },
            },
            OrderItems: {
                select: {
                    id: true,
                    quantity: true,
                    price: true,
                    Books: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                },
            },
        },
        orderBy: { created_at: 'desc' },
    });
};
exports.getAllOrders = getAllOrders;
const getOrderById = async (id) => {
    return await prisma_js_1.default.orders.findUnique({
        where: { id },
        include: {
            Users: {
                select: { id: true, name: true, email: true },
            },
            Addresses: true,
            OrderItems: {
                include: {
                    Books: {
                        select: { id: true, title: true, slug: true },
                    },
                },
            },
            Payments: true,
        },
    });
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (id, status) => {
    return await prisma_js_1.default.orders.update({
        where: { id },
        data: { status },
    });
};
exports.updateOrderStatus = updateOrderStatus;
const deleteOrder = async (id) => {
    return await prisma_js_1.default.orders.delete({
        where: { id },
    });
};
exports.deleteOrder = deleteOrder;
const countOrders = async () => {
    return await prisma_js_1.default.orders.count();
};
exports.countOrders = countOrders;
const getOrdersByUserId = async (userId) => {
    return await prisma_js_1.default.orders.findMany({
        where: { user_id: userId },
        select: {
            id: true,
            total: true,
            status: true,
            created_at: true,
            Addresses: {
                select: {
                    address: true,
                    phone: true,
                    Provinces: { select: { name: true } },
                    Districts: { select: { name: true } },
                    Wards: { select: { name: true } },
                },
            },
            OrderItems: {
                select: {
                    id: true,
                    quantity: true,
                    price: true,
                    Books: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            BookImages: {
                                select: { url: true },
                                take: 1,
                            },
                        },
                    },
                },
            },
            Payments: { select: { method: true, status: true } },
        },
        orderBy: { created_at: 'desc' },
    });
};
exports.getOrdersByUserId = getOrdersByUserId;
const getRecentOrders = async (limit = 10) => {
    return await prisma_js_1.default.orders.findMany({
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
            id: true,
            total: true,
            status: true,
            created_at: true,
            Users: {
                select: { name: true },
            },
            OrderItems: {
                select: { id: true },
            },
        },
    });
};
exports.getRecentOrders = getRecentOrders;
