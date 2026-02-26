"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWards = exports.getDistricts = exports.getProvinces = exports.deleteAddress = exports.update = exports.create = exports.getById = exports.getByUserId = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const getByUserId = async (userId) => {
    return await prisma_js_1.default.addresses.findMany({
        where: { user_id: userId },
        include: {
            Provinces: { select: { name: true } },
            Districts: { select: { name: true } },
            Wards: { select: { name: true } },
        },
        orderBy: { id: 'desc' },
    });
};
exports.getByUserId = getByUserId;
const getById = async (id) => {
    return await prisma_js_1.default.addresses.findUnique({
        where: { id },
        include: {
            Provinces: { select: { name: true } },
            Districts: { select: { name: true } },
            Wards: { select: { name: true } },
        },
    });
};
exports.getById = getById;
const create = async (userId, data) => {
    return await prisma_js_1.default.addresses.create({
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
exports.create = create;
const update = async (id, data) => {
    return await prisma_js_1.default.addresses.update({
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
exports.update = update;
const deleteAddress = async (id) => {
    return await prisma_js_1.default.addresses.delete({
        where: { id },
    });
};
exports.deleteAddress = deleteAddress;
// Location lookups
const getProvinces = async () => {
    return await prisma_js_1.default.provinces.findMany({
        orderBy: { name: 'asc' },
    });
};
exports.getProvinces = getProvinces;
const getDistricts = async (provinceId) => {
    return await prisma_js_1.default.districts.findMany({
        where: { province_code: provinceId },
        orderBy: { name: 'asc' },
    });
};
exports.getDistricts = getDistricts;
const getWards = async (districtId) => {
    return await prisma_js_1.default.wards.findMany({
        where: { district_code: districtId },
        orderBy: { name: 'asc' },
    });
};
exports.getWards = getWards;
