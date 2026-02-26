import * as checkoutRepo from './checkout.repositories.js';
export const placeOrder = async (userId, addressId, paymentMethod) => {
    const validMethods = ['cod', 'bank_transfer'];
    if (!validMethods.includes(paymentMethod)) {
        throw { status: 400, message: 'Phương thức thanh toán không hợp lệ' };
    }
    if (!addressId) {
        throw { status: 400, message: 'Vui lòng chọn địa chỉ giao hàng' };
    }
    return await checkoutRepo.placeOrder(userId, addressId, paymentMethod);
};
export const getUserAddresses = async (userId) => {
    return await checkoutRepo.getUserAddresses(userId);
};
