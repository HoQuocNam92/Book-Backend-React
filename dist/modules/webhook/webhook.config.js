"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_services_1 = require("../orders/order.services");
const order_queue_1 = __importDefault(require("../../queue/order.queue"));
const webhook = async (req, res, next) => {
    try {
        const body = req.body;
        if (body.callback_query) {
            const data = body.callback_query.data;
            const orderId = Number(data.split('_')[1]);
            const status = data.startsWith('confirm_') ? 'confirmed' : 'cancelled';
            await (0, order_services_1.updateOrderStatus)(orderId, status);
            await order_queue_1.default.add('notiOrder', { orderId, status }, {
                removeOnComplete: true, attempts: 5, backoff: {
                    type: "exponential",
                    delay: 3000,
                },
            });
        }
        return res.status(200).json({ message: 'Webhook received' });
    }
    catch (error) {
        next(error);
    }
};
exports.default = webhook;
