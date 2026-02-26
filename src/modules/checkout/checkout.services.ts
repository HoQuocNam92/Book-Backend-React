import orderQueue from '../../queue/order.queue.js';
import * as checkoutRepo from './checkout.repositories.js';

export const placeOrder = async (userId: number, addressId: number, paymentMethod: string) => {
    const validMethods = ['cod', 'bank_transfer'];
    if (!validMethods.includes(paymentMethod)) {
        throw new Error("METHOD_NOT_SUPPORTED")
    }

    if (!addressId) {
        throw new Error("ADDRESS_NOT_SELECTED");
    }
    const order = await checkoutRepo.placeOrder(userId, addressId, paymentMethod);
    await orderQueue.add('newOrder', order, {
        removeOnComplete: true, attempts: 5, backoff: {
            type: "exponential",
            delay: 3000,
        },
    });
    return order;
};

export const getUserAddresses = async (userId: number) => {
    return await checkoutRepo.getUserAddresses(userId);
};
