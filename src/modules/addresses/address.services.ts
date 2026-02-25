import * as addressRepo from './address.repositories';

export const getByUserId = async (userId: number) => {
    return await addressRepo.getByUserId(userId);
};

export const getById = async (id: number) => {
    const address = await addressRepo.getById(id);
    if (!address) {
        throw { status: 404, message: 'Không tìm thấy địa chỉ' };
    }
    return address;
};

export const create = async (
    userId: number,
    data: {
        address: string;
        phone?: string;
        province_id?: number;
        district_id?: number;
        ward_id?: number;
    }
) => {
    if (!data.address || data.address.trim() === '') {
        throw { status: 400, message: 'Vui lòng nhập địa chỉ' };
    }
    return await addressRepo.create(userId, data);
};

export const update = async (
    userId: number,
    id: number,
    data: {
        address?: string;
        phone?: string;
        province_id?: number;
        district_id?: number;
        ward_id?: number;
    }
) => {
    const existing = await addressRepo.getById(id);
    if (!existing) {
        throw { status: 404, message: 'Không tìm thấy địa chỉ' };
    }
    if (existing.user_id !== userId) {
        throw { status: 403, message: 'Bạn không có quyền sửa địa chỉ này' };
    }
    return await addressRepo.update(id, data);
};

export const deleteAddress = async (userId: number, id: number) => {
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

export const getDistricts = async (provinceId: number) => {
    return await addressRepo.getDistricts(provinceId);
};

export const getWards = async (districtId: number) => {
    return await addressRepo.getWards(districtId);
};
