import * as addressServices from './address.services.js';
export const getMyAddresses = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const addresses = await addressServices.getByUserId(userId);
        res.status(200).json({ message: 'Lấy danh sách địa chỉ thành công', data: addresses });
    }
    catch (error) {
        next(error);
    }
};
export const createAddress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const address = await addressServices.create(userId, req.body);
        res.status(201).json({ message: 'Thêm địa chỉ thành công', data: address });
    }
    catch (error) {
        next(error);
    }
};
export const updateAddress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const address = await addressServices.update(userId, id, req.body);
        res.status(200).json({ message: 'Cập nhật địa chỉ thành công', data: address });
    }
    catch (error) {
        next(error);
    }
};
export const deleteAddress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        await addressServices.deleteAddress(userId, id);
        res.status(200).json({ message: 'Xóa địa chỉ thành công' });
    }
    catch (error) {
        next(error);
    }
};
export const getProvinces = async (req, res, next) => {
    try {
        const provinces = await addressServices.getProvinces();
        res.status(200).json({ message: 'Lấy danh sách tỉnh thành công', data: provinces });
    }
    catch (error) {
        next(error);
    }
};
export const getDistricts = async (req, res, next) => {
    try {
        const provinceId = parseInt(req.params.provinceId);
        if (isNaN(provinceId)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const districts = await addressServices.getDistricts(provinceId);
        res.status(200).json({ message: 'Lấy danh sách quận/huyện thành công', data: districts });
    }
    catch (error) {
        next(error);
    }
};
export const getWards = async (req, res, next) => {
    try {
        const districtId = parseInt(req.params.districtId);
        if (isNaN(districtId)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const wards = await addressServices.getWards(districtId);
        res.status(200).json({ message: 'Lấy danh sách phường/xã thành công', data: wards });
    }
    catch (error) {
        next(error);
    }
};
