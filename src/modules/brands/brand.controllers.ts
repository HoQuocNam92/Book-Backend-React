import { Request, Response, NextFunction } from 'express';
import * as brandServices from './brand.services.js';
import { brandSchema } from './brand.schema.js';



export const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const brands = await brandServices.getAllBrands();
        res.status(200).json(brands);
    } catch (error) {
        next(error);
    }
}

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file as Express.Multer.File;
        console.log('Received file:', file);

        if (!file) {
            return res.status(403).json({ message: "Vui lòng thêm ảnh" });
        }
        const { name, description } = req.body;
        const validatedBrand = brandSchema.parse({ name, description });
        const brand = await brandServices.createBrand(validatedBrand, file);
        res.status(201).json(brand);
    } catch (error) {
        next(error);
    }
}

export const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({ message: "ID thương hiệu không hợp lệ" });
        }
        const { name, description } = req.body;
        const file = req?.file as Express.Multer.File;
        const validatedBrand = brandSchema.parse({ name, description });
        const brand = await brandServices.updateBrand(Number(id), { ...validatedBrand }, file);
        res.status(200).json(brand);
    } catch (error) {
        next(error);
    }
}

export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({ message: "ID thương hiệu không hợp lệ" });
        }
        await brandServices.deleteBrand(Number(id));
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}