import * as orderRepo from './order.repositories.js';

export const getAllOrders = async () => {
    return await orderRepo.getAllOrders();
};

export const getOrderById = async (id: number) => {
    const order = await orderRepo.getOrderById(id);
    if (!order) {
        throw { status: 404, message: 'Không tìm thấy đơn hàng' };
    }
    return order;
};

export const updateOrderStatus = async (id: number, status: string) => {
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

export const getMyOrders = async (userId: number) => {
    return await orderRepo.getOrdersByUserId(userId);
};

export const deleteOrder = async (id: number) => {
    const order = await orderRepo.getOrderById(id);
    if (!order) {
        throw { status: 404, message: 'Không tìm thấy đơn hàng' };
    }
    return await orderRepo.deleteOrder(id);
};
