

import { categorySchema } from './category.schema.js';
import * as categoryService from './category.services.js';
import { Request, Response, NextFunction } from 'express';



export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const { categories, totalPages } = await categoryService.getAllCategories(page);
        res.status(200).json({ message: "Lấy danh mục thành công", data: categories, totalPages });
    } catch (error) {
        next(error);
    }
}


export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = categorySchema.parse(req.body);
        const category = await categoryService.createCategory(validatedData);

        res.status(201).json({ message: "Tạo danh mục thành công", data: category });
    } catch (error) {
        next(error);
    }
}


export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        const validatedData = categorySchema.parse(req.body);
        const category = await categoryService.updateCategory(id, validatedData);
        res.status(200).json({ message: "Cập nhật danh mục thành công", data: category });
    } catch (error) {
        next(error);
    }
}


export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        await categoryService.deleteCategory(id);
        res.status(200).json({ message: "Xóa danh mục thành công" });
    } catch (error) {
        next(error);
    }
}
