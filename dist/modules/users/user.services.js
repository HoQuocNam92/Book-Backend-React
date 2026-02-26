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
exports.updateProfile = exports.getProfile = exports.deleteUser = exports.getUserById = exports.getAllUsers = void 0;
const userRepo = __importStar(require("./user.repositories.js"));
const getAllUsers = async () => {
    return await userRepo.getAllUsers();
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    const user = await userRepo.getUserById(id);
    if (!user) {
        throw { status: 404, message: 'Không tìm thấy người dùng' };
    }
    return user;
};
exports.getUserById = getUserById;
const deleteUser = async (id) => {
    const user = await userRepo.getUserById(id);
    if (!user) {
        throw { status: 404, message: 'Không tìm thấy người dùng' };
    }
    return await userRepo.deleteUser(id);
};
exports.deleteUser = deleteUser;
const getProfile = async (userId) => {
    const profile = await userRepo.getProfile(userId);
    if (!profile) {
        throw { status: 404, message: 'Không tìm thấy người dùng' };
    }
    return profile;
};
exports.getProfile = getProfile;
const updateProfile = async (userId, data, file) => {
    return await userRepo.updateProfile(userId, data, file);
};
exports.updateProfile = updateProfile;
