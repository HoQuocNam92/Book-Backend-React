import prisma from '../../utils/prisma';

export const getByUserId = async (userId: number) => {
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

export const getById = async (id: number) => {
    return await prisma.addresses.findUnique({
        where: { id },
        include: {
            Provinces: { select: { name: true } },
            Districts: { select: { name: true } },
            Wards: { select: { name: true } },
        },
    });
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

export const update = async (
    id: number,
    data: {
        address?: string;
        phone?: string;
        province_id?: number;
        district_id?: number;
        ward_id?: number;
    }
) => {
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

export const deleteAddress = async (id: number) => {
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

export const getDistricts = async (provinceId: number) => {
    return await prisma.districts.findMany({
        where: { province_code: provinceId },
        orderBy: { name: 'asc' },
    });
};

export const getWards = async (districtId: number) => {
    return await prisma.wards.findMany({
        where: { district_code: districtId },
        orderBy: { name: 'asc' },
    });
};
