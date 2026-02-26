import * as addressRepo from './address.repositories.js';
export const getByUserId = async (userId) => {
    return await addressRepo.getByUserId(userId);
};
export const getById = async (id) => {
    const address = await addressRepo.getById(id);
    if (!address) {
        throw { status: 404, message: 'Không tìm thấy địa chỉ' };
    }
    return address;
};
export const create = async (userId, data) => {
    if (!data.address || data.address.trim() === '') {
        throw { status: 400, message: 'Vui lòng nhập địa chỉ' };
    }
    return await addressRepo.create(userId, data);
};
export const update = async (userId, id, data) => {
    const existing = await addressRepo.getById(id);
    if (!existing) {
        throw { status: 404, message: 'Không tìm thấy địa chỉ' };
    }
    if (existing.user_id !== userId) {
        throw { status: 403, message: 'Bạn không có quyền sửa địa chỉ này' };
    }
    return await addressRepo.update(id, data);
};
export const deleteAddress = async (userId, id) => {
    const existing = await addressRepo.getById(id);
    if (!existing) {
        throw { status: 404, message: 'Không tìm thấy địa chỉ' };
    }
    if (existing.user_id !== userId) {
        throw { status: 403, message: 'Bạn không có quyền xóa địa chỉ này' };
    }
    return await addressRepo.deleteAddress(id);
};
export const getProvinces = async () => {
    return await addressRepo.getProvinces();
};
export const getDistricts = async (provinceId) => {
    return await addressRepo.getDistricts(provinceId);
};
export const getWards = async (districtId) => {
    return await addressRepo.getWards(districtId);
};
