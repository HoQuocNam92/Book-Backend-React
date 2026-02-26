import { categorySchema } from './category.schema.js';
import * as categoryService from './category.services.js';
export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({ message: "Lấy danh mục thành công", data: categories });
    }
    catch (error) {
        next(error);
    }
};
export const createCategory = async (req, res, next) => {
    try {
        const validatedData = categorySchema.parse(req.body);
        const category = await categoryService.createCategory(validatedData);
        res.status(201).json({ message: "Tạo danh mục thành công", data: category });
    }
    catch (error) {
        next(error);
    }
};
export const updateCategory = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        const validatedData = categorySchema.parse(req.body);
        const category = await categoryService.updateCategory(id, validatedData);
        res.status(200).json({ message: "Cập nhật danh mục thành công", data: category });
    }
    catch (error) {
        next(error);
    }
};
export const deleteCategory = async (req, res, next) => {
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
