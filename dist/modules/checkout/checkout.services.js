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
exports.getUserAddresses = exports.placeOrder = void 0;
const order_queue_js_1 = __importDefault(require("../../queue/order.queue.js"));
const checkoutRepo = __importStar(require("./checkout.repositories.js"));
const placeOrder = async (userId, addressId, paymentMethod) => {
    const validMethods = ['cod', 'bank_transfer'];
    if (!validMethods.includes(paymentMethod)) {
        throw new Error("METHOD_NOT_SUPPORTED");
    }
    if (!addressId) {
        throw new Error("ADDRESS_NOT_SELECTED");
    }
    const order = await checkoutRepo.placeOrder(userId, addressId, paymentMethod);
    await order_queue_js_1.default.add('newOrder', order, {
        removeOnComplete: true, attempts: 5, backoff: {
            type: "exponential",
            delay: 3000,
        },
    });
    return order;
};
exports.placeOrder = placeOrder;
const getUserAddresses = async (userId) => {
    return await checkoutRepo.getUserAddresses(userId);
};
exports.getUserAddresses = getUserAddresses;
