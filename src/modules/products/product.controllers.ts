


import { NextFunction, Request, Response } from 'express'
import * as productService from './product.services.js'
import { deleteProductSchema, productQuickActionSchema, productSchema } from './product.schema.js';


export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await productService.getHomeProducts();
        return res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", data });
    } catch (error) {
        next(error)
    }
}

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slug = req.params.slug as string;
        const data = await productService.getProductBySlug(slug);
        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        return res.status(200).json({ message: "Lấy sản phẩm thành công", data });
    } catch (error) {
        next(error)
    }
}

export const getProductByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pageNumber = Number(req.query?.page) || 1;

        const category_slug = req.params?.category_slug || "";
        const { data, pagination, category } = await productService.getProductByCategory(category_slug as string, pageNumber);
        return res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", data, pagination, category });
    } catch (error) {
        next(error)
    }
}






export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = productSchema.parse(req.body);
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(403).json({ message: "Vui lòng thêm ảnh" });
        }

        const book = await productService.createProduct(files, data);
        return res.status(200).json({ message: "Tạo sản phẩm thành công", book });
    } catch (error) {
        next(error)
    }
}



export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = deleteProductSchema.parse({ id: Number(req.params?.id) })
        const book = await productService.deleteProduct(data);
        return res.status(200).json({ message: "Xóa sản phẩm thành công", book });
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params?.id);
        const data = productSchema.parse(req.body)
        const files = req.files as Express.Multer.File[];
        const book = await productService.updateProduct(files, id, data);
        return res.status(200).json({ message: "Cập nhật sản phẩm thành công", book });
    } catch (error) {
        next(error)
    }
}

export const updateProductQuickActions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params?.id);
        const data = req.body
        const validatedData = productQuickActionSchema.parse(data)

        const book = await productService.updateProductQuickActions(id, validatedData);
        return res.status(200).json({ message: "Cập nhật sản phẩm thành công", book });
    }
    catch (error) {
        next(error)
    }
}