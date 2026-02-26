import * as userServices from './user.services.js';
import { userProfileSchema } from './user.schema.js';
export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const profile = await userServices.getProfile(userId);
        res.status(200).json({ message: 'Lấy hồ sơ thành công', data: profile });
    }
    catch (error) {
        next(error);
    }
};
export const updateProfile = async (req, res, next) => {
    try {
        const file = req.file;
        const userId = req.user.id;
        const validatedData = userProfileSchema.parse(req.body);
        const profile = await userServices.updateProfile(userId, validatedData, file);
        res.status(200).json({ message: 'Cập nhật hồ sơ thành công', data: profile });
    }
    catch (error) {
        next(error);
    }
};
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userServices.getAllUsers();
        res.status(200).json({ message: 'Lấy danh sách người dùng thành công', data: users });
    }
    catch (error) {
        next(error);
    }
};
export const getUserById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const user = await userServices.getUserById(id);
        res.status(200).json({ message: 'Lấy người dùng thành công', data: user });
    }
    catch (error) {
        next(error);
    }
};
export const deleteUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        await userServices.deleteUser(id);
        res.status(200).json({ message: 'Xóa người dùng thành công' });
    }
    catch (error) {
        next(error);
    }
};
