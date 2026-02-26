import prisma from '../../utils/prisma.js';
export const findUserByEmail = async (email) => {
    return await prisma.users.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            is_google: true,
            UserRoles: {
                select: {
                    role_id: true,
                },
            },
        },
    });
};
export const createUser = async (data, is_google = 0, avatar = null) => {
    return await prisma.users.create({
        data: {
            is_google: !!is_google,
            ...data,
            UserRoles: {
                create: {
                    role_id: 2,
                }
            },
            UserProfile: {
                create: {
                    avatar: avatar
                }
            }
        },
    });
};
export const addTokenToResetPassword = async (data) => {
    return await prisma.resetPassword.create({
        data,
    });
};
export const getResetPassword = async (user_id) => {
    return await prisma.resetPassword.findFirst({ where: { user_id: user_id } });
};
export const updateResetPassword = async (user_id) => {
    return await prisma.resetPassword.updateMany({ where: { user_id }, data: { is_used: true } });
};
export const updatePassword = async (id, password) => {
    return await prisma.users.update({ where: { id: id }, data: password });
};
export const addRefreshTokens = async (data) => {
    return await prisma.refreshTokens.create({ data });
};
export const getRefreshTokens = async (id) => {
    return await prisma.refreshTokens.findFirst({ where: { UserId: id } });
};
export const deleteRefreshTokens = async (user_id) => {
    return await prisma.refreshTokens.deleteMany({ where: { UserId: user_id } });
};
