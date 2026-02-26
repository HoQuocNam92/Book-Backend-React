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
exports.getWards = exports.getDistricts = exports.getProvinces = exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getMyAddresses = void 0;
const addressServices = __importStar(require("./address.services.js"));
const getMyAddresses = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const addresses = await addressServices.getByUserId(userId);
        res.status(200).json({ message: 'Lấy danh sách địa chỉ thành công', data: addresses });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyAddresses = getMyAddresses;
const createAddress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const address = await addressServices.create(userId, req.body);
        res.status(201).json({ message: 'Thêm địa chỉ thành công', data: address });
    }
    catch (error) {
        next(error);
    }
};
exports.createAddress = createAddress;
const updateAddress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const address = await addressServices.update(userId, id, req.body);
        res.status(200).json({ message: 'Cập nhật địa chỉ thành công', data: address });
    }
    catch (error) {
        next(error);
    }
};
exports.updateAddress = updateAddress;
const deleteAddress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        await addressServices.deleteAddress(userId, id);
        res.status(200).json({ message: 'Xóa địa chỉ thành công' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAddress = deleteAddress;
const getProvinces = async (req, res, next) => {
    try {
        const provinces = await addressServices.getProvinces();
        res.status(200).json({ message: 'Lấy danh sách tỉnh thành công', data: provinces });
    }
    catch (error) {
        next(error);
    }
};
exports.getProvinces = getProvinces;
const getDistricts = async (req, res, next) => {
    try {
        const provinceId = parseInt(req.params.provinceId);
        if (isNaN(provinceId)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const districts = await addressServices.getDistricts(provinceId);
        res.status(200).json({ message: 'Lấy danh sách quận/huyện thành công', data: districts });
    }
    catch (error) {
        next(error);
    }
};
exports.getDistricts = getDistricts;
const getWards = async (req, res, next) => {
    try {
        const districtId = parseInt(req.params.districtId);
        if (isNaN(districtId)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const wards = await addressServices.getWards(districtId);
        res.status(200).json({ message: 'Lấy danh sách phường/xã thành công', data: wards });
    }
    catch (error) {
        next(error);
    }
};
exports.getWards = getWards;
