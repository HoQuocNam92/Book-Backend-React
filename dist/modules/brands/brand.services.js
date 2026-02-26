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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getAllBrands = void 0;
const slugify_1 = __importDefault(require("slugify"));
const brandRepositories = __importStar(require("./brand.repositories.js"));
const getAllBrands = async () => {
    return await brandRepositories.getAllBrands();
};
exports.getAllBrands = getAllBrands;
const createBrand = async (data, file) => {
    const slug = (0, slugify_1.default)(data.name, { lower: true });
    return await brandRepositories.createBrand({ ...data, slug }, file);
};
exports.createBrand = createBrand;
const updateBrand = async (id, data, file) => {
    const existingBrand = await brandRepositories.getBrandById(id);
    if (!existingBrand) {
        throw new Error("NOT_FOUND_BRAND");
    }
    const slug = (0, slugify_1.default)(data.name, { lower: true });
    return await brandRepositories.updateBrand({ id, ...data, slug }, file);
};
exports.updateBrand = updateBrand;
const deleteBrand = async (id) => {
    const existingBrand = await brandRepositories.getBrandById(id);
    if (!existingBrand) {
        throw new Error("NOT_FOUND_BRAND");
    }
    return await brandRepositories.deleteBrand(id);
};
exports.deleteBrand = deleteBrand;
