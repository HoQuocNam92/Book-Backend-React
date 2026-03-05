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
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getAllBrands = void 0;
const brandServices = __importStar(require("./brand.services.js"));
const brand_schema_js_1 = require("./brand.schema.js");
const getAllBrands = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { brands, totalPages } = await brandServices.getAllBrands(page);
        res.status(200).json({ message: "Lấy danh sách thương hiệu thành công", data: brands, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBrands = getAllBrands;
const createBrand = async (req, res, next) => {
    try {
        const file = req.file;
        console.log('Received file:', file);
        if (!file) {
            return res.status(403).json({ message: "Vui lòng thêm ảnh" });
        }
        const { name, description } = req.body;
        const validatedBrand = brand_schema_js_1.brandSchema.parse({ name, description });
        const brand = await brandServices.createBrand(validatedBrand, file);
        res.status(201).json(brand);
    }
    catch (error) {
        next(error);
    }
};
exports.createBrand = createBrand;
const updateBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({ message: "ID thương hiệu không hợp lệ" });
        }
        const { name, description } = req.body;
        const file = req?.file;
        const validatedBrand = brand_schema_js_1.brandSchema.parse({ name, description });
        const brand = await brandServices.updateBrand(Number(id), { ...validatedBrand }, file);
        res.status(200).json(brand);
    }
    catch (error) {
        next(error);
    }
};
exports.updateBrand = updateBrand;
const deleteBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({ message: "ID thương hiệu không hợp lệ" });
        }
        await brandServices.deleteBrand(Number(id));
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBrand = deleteBrand;
