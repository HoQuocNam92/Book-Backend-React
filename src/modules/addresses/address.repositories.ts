import prisma from '../../utils/prisma.js';
import { AddressInput, } from './address.schema.js';

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
    data: AddressInput
) => {
    return await prisma.addresses.create({
        data: {
            user_id: userId,
            address: data.address,
            phone: data.phone,
            province_code: data.province_code,
            district_code: data.district_code,
            ward_code: data.ward_code,
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
    data: AddressInput
) => {
    return await prisma.addresses.update({
        where: { id },
        data: {
            address: data.address,
            phone: data.phone,
            province_code: data.province_code,
            district_code: data.district_code,
            ward_code: data.ward_code,
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
