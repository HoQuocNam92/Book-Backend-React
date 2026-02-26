import prisma from '../../utils/prisma.js';
export const getByUserId = async (userId) => {
    return await prisma.addresses.findMany({
        where: { user_id: userId },
        include: {
            Provinces: { select: { name: true } },
            Districts: { select: { name: true } },
            Wards: { select: { name: true } },
        },
        orderBy: { id: 'desc' },
    });
};
export const getById = async (id) => {
    return await prisma.addresses.findUnique({
        where: { id },
        include: {
            Provinces: { select: { name: true } },
            Districts: { select: { name: true } },
            Wards: { select: { name: true } },
        },
    });
};
export const create = async (userId, data) => {
    return await prisma.addresses.create({
        data: {
            user_id: userId,
            address: data.address,
            phone: data.phone,
            province_id: data.province_id,
            district_id: data.district_id,
            ward_id: data.ward_id,
        },
        include: {
            Provinces: { select: { name: true } },
            Districts: { select: { name: true } },
            Wards: { select: { name: true } },
        },
    });
};
export const update = async (id, data) => {
    return await prisma.addresses.update({
        where: { id },
        data,
        include: {
            Provinces: { select: { name: true } },
            Districts: { select: { name: true } },
            Wards: { select: { name: true } },
        },
    });
};
export const deleteAddress = async (id) => {
    return await prisma.addresses.delete({
        where: { id },
    });
};
// Location lookups
export const getProvinces = async () => {
    return await prisma.provinces.findMany({
        orderBy: { name: 'asc' },
    });
};
export const getDistricts = async (provinceId) => {
    return await prisma.districts.findMany({
        where: { province_code: provinceId },
        orderBy: { name: 'asc' },
    });
};
export const getWards = async (districtId) => {
    return await prisma.wards.findMany({
        where: { district_code: districtId },
        orderBy: { name: 'asc' },
    });
};
