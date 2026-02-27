import { Worker } from "bullmq";
import sendTelegramMessage from "../modules/telegram-bot/telegram_bot.js";

import dotenv from 'dotenv';

dotenv.config();

const worker = new Worker("orderQueue", async (job) => {
    if (job.name === "newOrder") {
        const { total, Addresses, Payments, Users, id, OrderItems } = job.data;

        await sendTelegramMessage({
            id: id,
            customerName: Users.name,
            totalPrice: total,
            phone: Users.UserProfile?.Phone || "N/A",
            address: Addresses.address,
            paymentMethod: Payments[0].method,
            items: OrderItems.map((item: any) => [item.quantity, item.price, item.Books.title]),
        });
    }
    if (job.name === "notiOrder") {
        const { orderId, status } = job.data;
        await sendTelegramMessage({
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
