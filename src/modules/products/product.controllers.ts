


import { NextFunction, Request, Response } from 'express'
import * as productService from './product.services'
import { deleteProductSchema, productSchema } from './product.schema';

import cloudinary from '../../utils/cloudinary'


export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pageNumber = Number(req.query?.page) || 1;
        console.log("Hello")
        const data = await productService.getProducts(pageNumber);
        return res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", data });
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
        if (!files || files.length === 0) {
            return res.status(403).json({ message: "Vui lòng thêm ảnh" });
        }

        const book = await productService.updateProduct(files, id, data);
        return res.status(200).json({ message: "Xóa sản phẩm thành công", book });
    } catch (error) {
        next(error)
    }
}

