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
exports.deleteUser = exports.getUserById = exports.getAllUsers = exports.updateProfile = exports.getProfile = void 0;
const userServices = __importStar(require("./user.services.js"));
const user_schema_js_1 = require("./user.schema.js");
const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const profile = await userServices.getProfile(userId);
        res.status(200).json({ message: 'Lấy hồ sơ thành công', data: profile });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const file = req.file;
        const userId = req.user.id;
        const validatedData = user_schema_js_1.userProfileSchema.parse(req.body);
        const profile = await userServices.updateProfile(userId, validatedData, file);
        res.status(200).json({ message: 'Cập nhật hồ sơ thành công', data: profile });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
const getAllUsers = async (req, res, next) => {
    try {
        const users = await userServices.getAllUsers();
        res.status(200).json({ message: 'Lấy danh sách người dùng thành công', data: users });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const user = await userServices.getUserById(id);
        res.status(200).json({ message: 'Lấy người dùng thành công', data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
const deleteUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        await userServices.deleteUser(id);
        res.status(200).json({ message: 'Xóa người dùng thành công' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
