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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategories = void 0;
const category_schema_js_1 = require("./category.schema.js");
const categoryService = __importStar(require("./category.services.js"));
const getAllCategories = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { categories, totalPages } = await categoryService.getAllCategories(page);
        res.status(200).json({ message: "Lấy danh mục thành công", data: categories, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCategories = getAllCategories;
const createCategory = async (req, res, next) => {
    try {
        const validatedData = category_schema_js_1.categorySchema.parse(req.body);
        const category = await categoryService.createCategory(validatedData);
        res.status(201).json({ message: "Tạo danh mục thành công", data: category });
    }
    catch (error) {
        next(error);
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        const validatedData = category_schema_js_1.categorySchema.parse(req.body);
        const category = await categoryService.updateCategory(id, validatedData);
        res.status(200).json({ message: "Cập nhật danh mục thành công", data: category });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        await categoryService.deleteCategory(id);
        res.status(200).json({ message: "Xóa danh mục thành công" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCategory = deleteCategory;
