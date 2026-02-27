import { NextFunction, Request, Response } from "express";
import { updateOrderStatus } from "../orders/order.services";
import orderQueue from "../../queue/order.queue";

const webhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        if (body.callback_query) {
            const data = body.callback_query.data;
            const orderId = Number(data.split('_')[1]);
            const status = data.startsWith('confirm_') ? 'confirmed' : 'cancelled';
            await updateOrderStatus(orderId, status);
            await orderQueue.add('notiOrder', { orderId, status }, {
                removeOnComplete: true, attempts: 5, backoff: {
                    type: "exponential",
                    delay: 3000,
                },
            });
        }
        return res.status(200).json({ message: 'Webhook received' });
    } catch (error) {
        next(error);
    }
}

export default webhook;