"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRefreshTokens = exports.getRefreshTokens = exports.addRefreshTokens = exports.updatePassword = exports.updateResetPassword = exports.getResetPassword = exports.addTokenToResetPassword = exports.createUser = exports.findUserByEmail = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const findUserByEmail = async (email) => {
    return await prisma_js_1.default.users.findUnique({
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
exports.findUserByEmail = findUserByEmail;
const createUser = async (data, is_google = 0, avatar = null) => {
    return await prisma_js_1.default.users.create({
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
exports.createUser = createUser;
const addTokenToResetPassword = async (data) => {
    return await prisma_js_1.default.resetPassword.create({
        data,
    });
};
exports.addTokenToResetPassword = addTokenToResetPassword;
const getResetPassword = async (user_id) => {
    return await prisma_js_1.default.resetPassword.findFirst({ where: { user_id: user_id } });
};
exports.getResetPassword = getResetPassword;
const updateResetPassword = async (user_id) => {
    return await prisma_js_1.default.resetPassword.updateMany({ where: { user_id }, data: { is_used: true } });
};
exports.updateResetPassword = updateResetPassword;
const updatePassword = async (id, password) => {
    return await prisma_js_1.default.users.update({ where: { id: id }, data: password });
};
exports.updatePassword = updatePassword;
const addRefreshTokens = async (data) => {
    return await prisma_js_1.default.refreshTokens.create({ data });
};
exports.addRefreshTokens = addRefreshTokens;
const getRefreshTokens = async (id) => {
    return await prisma_js_1.default.refreshTokens.findFirst({ select: { TokenHash: true, ExpiresAt: true }, where: { UserId: id } });
};
exports.getRefreshTokens = getRefreshTokens;
const deleteRefreshTokens = async (user_id) => {
    return await prisma_js_1.default.refreshTokens.deleteMany({ where: { UserId: user_id } });
};
exports.deleteRefreshTokens = deleteRefreshTokens;
