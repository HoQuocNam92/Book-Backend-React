import * as orderServices from './order.services.js';
export const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await orderServices.getMyOrders(userId);
        res.status(200).json({ message: 'Lấy đơn hàng của bạn thành công', data: orders });
    }
    catch (error) {
        next(error);
    }
};
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderServices.getAllOrders();
        res.status(200).json({ message: 'Lấy danh sách đơn hàng thành công', data: orders });
    }
    catch (error) {
        next(error);
    }
};
export const getOrderById = async (req, res, next) => {
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
export const updateOrderStatus = async (req, res, next) => {
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
export const deleteOrder = async (req, res, next) => {
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
