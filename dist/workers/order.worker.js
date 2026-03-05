"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const telegram_bot_js_1 = __importDefault(require("../modules/telegram-bot/telegram_bot.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const worker = new bullmq_1.Worker("orderQueue", async (job) => {
    if (job.name === "newOrder") {
        const { total, Addresses, Payments, Users, id, OrderItems } = job.data;
        await (0, telegram_bot_js_1.default)({
            id: id,
            customerName: Users.name,
            totalPrice: total,
            phone: Users.UserProfile?.Phone || "N/A",
            address: Addresses.address,
            paymentMethod: Payments[0].method,
            items: OrderItems.map((item) => [item.quantity, item.price, item.Books.title]),
        });
    }
    if (job.name === "notiOrder") {
        const { orderId, status } = job.data;
        await (0, telegram_bot_js_1.default)({
            id: orderId,
            status: status,
        }, "notiOrder");
    }
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
});
worker.on("completed", (job) => {
    console.log("Job completed:", job.id);
});
worker.on("failed", (job, err) => {
    console.log("Job failed:", err);
});
