"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWards = exports.getDistricts = exports.getProvinces = exports.deleteAddress = exports.update = exports.create = exports.getById = exports.getByUserId = void 0;
const addressRepo = __importStar(require("./address.repositories.js"));
const getByUserId = async (userId) => {
    return await addressRepo.getByUserId(userId);
};
exports.getByUserId = getByUserId;
const getById = async (id) => {
    const address = await addressRepo.getById(id);
    if (!address) {
        throw { status: 404, message: 'Không tìm thấy địa chỉ' };
    }
    return address;
};
exports.getById = getById;
const create = async (userId, data) => {
    if (!data.address || data.address.trim() === '') {
        throw { status: 400, message: 'Vui lòng nhập địa chỉ' };
    }
    return await addressRepo.create(userId, data);
};
exports.create = create;
const update = async (userId, id, data) => {
    const existing = await addressRepo.getById(id);
    if (!existing) {
        throw { status: 404, message: 'Không tìm thấy địa chỉ' };
    }
    if (existing.user_id !== userId) {
        throw { status: 403, message: 'Bạn không có quyền sửa địa chỉ này' };
    }
    return await addressRepo.update(id, data);
};
exports.update = update;
const deleteAddress = async (userId, id) => {
    const existing = await addressRepo.getById(id);
    if (!existing) {
        throw { status: 404, message: 'Không tìm thấy địa chỉ' };
    }
    if (existing.user_id !== userId) {
        throw { status: 403, message: 'Bạn không có quyền xóa địa chỉ này' };
    }
    return await addressRepo.deleteAddress(id);
};
exports.deleteAddress = deleteAddress;
const getProvinces = async () => {
    return await addressRepo.getProvinces();
};
exports.getProvinces = getProvinces;
const getDistricts = async (provinceId) => {
    return await addressRepo.getDistricts(provinceId);
};
exports.getDistricts = getDistricts;
const getWards = async (districtId) => {
    return await addressRepo.getWards(districtId);
};
exports.getWards = getWards;
