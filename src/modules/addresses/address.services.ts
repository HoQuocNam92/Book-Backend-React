import * as addressRepo from './address.repositories.js';
import { AddressInput } from './address.schema.js';

export const getByUserId = async (userId: number) => {
    return await addressRepo.getByUserId(userId);
};

export const getById = async (id: number) => {
    const address = await addressRepo.getById(id);
    if (!address) {
        throw new Error("NOT_FOUND_ADDRESS")
    }
    return address;
};

export const create = async (
    userId: number,
    data: AddressInput
) => {
    if (!data.address || data.address.trim() === '') {
        throw new Error("ADDRESS_REQUIRED")
    }
    return await addressRepo.create(userId, data);
};

export const update = async (
    userId: number,
    id: number,
    data: AddressInput
) => {
    const existing = await addressRepo.getById(id);
    if (!existing) {
        throw new Error("NOT_FOUND_ADDRESS")
    }
    if (existing.user_id !== userId) {
        throw new Error("FORBIDDEN_ADDRESS")
    }
    return await addressRepo.update(id, data);
};

export const deleteAddress = async (userId: number, id: number) => {
    const existing = await addressRepo.getById(id);
    if (!existing) {
        throw new Error("NOT_FOUND_ADDRESS")
    }
    if (existing.user_id !== userId) {
        throw new Error("FORBIDDEN_ADDRESS")
    }
    return await addressRepo.deleteAddress(id);
};

export const getProvinces = async () => {
    return await addressRepo.getProvinces();
};

export const getDistricts = async (provinceId: number) => {
    return await addressRepo.getDistricts(provinceId);
};

export const getWards = async (districtId: number) => {
    return await addressRepo.getWards(districtId);
};
