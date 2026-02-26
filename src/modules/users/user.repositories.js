import prisma from '../../utils/prisma.js';
import cloudinary from '../../utils/cloudinary.js';
export const getAllUsers = async () => {
    return await prisma.users.findMany({
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
};
export const getUserById = async (id) => {
    return await prisma.users.findUnique({
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
export const deleteUser = async (id) => {
    return await prisma.users.delete({
        where: { id },
    });
};
export const countUsers = async () => {
    return await prisma.users.count();
};
export const getProfile = async (userId) => {
    return await prisma.users.findUnique({
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
export const updateProfile = async (userId, data, file) => {
    const { name, ...profileData } = data;
    let avatar = undefined;
    await prisma.$transaction(async (tx) => {
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
                avatar = await cloudinary.uploader.upload(baseURL, {
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
                await cloudinary.uploader.destroy(avatar.public_id);
            }
            throw new Error('UPDATE_PROFILE_FAILED');
        }
    });
};
