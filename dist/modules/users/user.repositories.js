"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.countUsers = exports.deleteUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const cloudinary_js_1 = __importDefault(require("../../utils/cloudinary.js"));
const page_size = 20;
const getAllUsers = async (page) => {
    const skip = (page - 1) * page_size;
    const user = await prisma_js_1.default.users.findMany({
        skip,
        take: page_size,
        select: {
            id: true,
            name: true,
            email: true,
            is_google: true,
            created_at: true,
            UserProfile: {
                select: {
                    Gender: true,
                    Phone: true,
                    Birth: true,
                    avatar: true,
                },
            },
            UserRoles: {
                select: {
                    Roles: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: { created_at: 'desc' },
    });
    const totalPages = Math.ceil(await prisma_js_1.default.users.count() / page_size);
    return {
        users: user,
        totalPages,
    };
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    return await prisma_js_1.default.users.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            is_google: true,
            created_at: true,
            UserProfile: true,
            UserRoles: {
                select: {
                    Roles: {
                        select: { name: true },
                    },
                },
            },
        },
    });
};
exports.getUserById = getUserById;
const deleteUser = async (id) => {
    return await prisma_js_1.default.users.delete({
        where: { id },
    });
};
exports.deleteUser = deleteUser;
const countUsers = async () => {
    return await prisma_js_1.default.users.count();
};
exports.countUsers = countUsers;
const getProfile = async (userId) => {
    return await prisma_js_1.default.users.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            created_at: true,
            UserProfile: {
                select: {
                    Gender: true,
                    Phone: true,
                    Birth: true,
                    avatar: true,
                },
            },
        },
    });
};
exports.getProfile = getProfile;
const updateProfile = async (userId, data, file) => {
    const { name, ...profileData } = data;
    let avatar = undefined;
    await prisma_js_1.default.$transaction(async (tx) => {
        try {
            if (name) {
                await tx.users.update({
                    where: { id: userId },
                    data: { name },
                });
            }
            const birthDate = profileData.birth ? new Date(profileData.birth) : undefined;
            if (file) {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const baseURL = `data:${file.mimetype};base64,${b64}`;
                avatar = await cloudinary_js_1.default.uploader.upload(baseURL, {
                    folder: 'avatars'
                });
            }
            await tx.userProfile.upsert({
                where: { User_id: userId },
                update: {
                    Gender: profileData.gender,
                    Phone: profileData.phone,
                    Birth: birthDate,
                    avatar: avatar.secure_url || undefined,
                },
                create: {
                    User_id: userId,
                    Gender: profileData.gender,
                    Phone: profileData.phone,
                    Birth: birthDate,
                    avatar: avatar.secure_url || undefined,
                },
            });
        }
        catch (error) {
            if (avatar) {
                await cloudinary_js_1.default.uploader.destroy(avatar.public_id);
            }
            throw new Error('UPDATE_PROFILE_FAILED');
        }
    });
};
exports.updateProfile = updateProfile;
