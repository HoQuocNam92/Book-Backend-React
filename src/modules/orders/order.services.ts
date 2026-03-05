import * as orderRepo from './order.repositories.js';

export const getAllOrders = async (page: number) => {
    return await orderRepo.getAllOrders(page);
};

export const getOrderById = async (id: number) => {
    const order = await orderRepo.getOrderById(id);
    if (!order) {
        throw { status: 404, message: 'Không tìm thấy đơn hàng' };
    }
    return order;
};

export const updateOrderStatus = async (id: number, status: string) => {
    const validStatuses = ['pending', 'confirmed', 'paid', 'shipping', 'completed', 'cancelled'];
    console.log('Updating order status:', status);
    if (!validStatuses.includes(status.toLowerCase())) {
        throw { status: 400, message: 'Trạng thái không hợp lệ' };
    }
    const order = await orderRepo.getOrderById(id);
    if (!order) {
        throw { status: 404, message: 'Không tìm thấy đơn hàng' };
    }
    return await orderRepo.updateOrderStatus(id, status);
};

export const getMyOrders = async (userId: number, page: number) => {
    return await orderRepo.getOrdersByUserId(userId, page);
};

export const deleteOrder = async (id: number) => {
    const order = await orderRepo.getOrderById(id);
    if (!order) {
        throw { status: 404, message: 'Không tìm thấy đơn hàng' };
    }
    return await orderRepo.deleteOrder(id);
};
