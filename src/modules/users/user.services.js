import * as userRepo from './user.repositories.js';
export const getAllUsers = async () => {
    return await userRepo.getAllUsers();
};
export const getUserById = async (id) => {
    const user = await userRepo.getUserById(id);
    if (!user) {
        throw { status: 404, message: 'Không tìm thấy người dùng' };
    }
    return user;
};
export const deleteUser = async (id) => {
    const user = await userRepo.getUserById(id);
    if (!user) {
        throw { status: 404, message: 'Không tìm thấy người dùng' };
    }
    return await userRepo.deleteUser(id);
};
export const getProfile = async (userId) => {
    const profile = await userRepo.getProfile(userId);
    if (!profile) {
        throw { status: 404, message: 'Không tìm thấy người dùng' };
    }
    return profile;
};
export const updateProfile = async (userId, data, file) => {
    return await userRepo.updateProfile(userId, data, file);
};
