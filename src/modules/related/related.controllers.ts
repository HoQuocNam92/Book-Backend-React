import { NextFunction, Request, Response } from "express";
import * as relatedService from './related.services.js';
export const getProductRelated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params?.id);
        const { products } = await relatedService.getRelatedProducts(id);
        return res.status(200).json({ message: "Lấy sản phẩm liên quan thành công", data: products });
    } catch (error) {
        next(error);
    }
}
