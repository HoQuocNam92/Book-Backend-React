import slugify from 'slugify';
import * as brandRepositories from './brand.repositories.js';
import { brandInput } from './brand.schema.js';





export const getAllBrands = async () => {
    return await brandRepositories.getAllBrands();
}

export const createBrand = async (data: brandInput, file: Express.Multer.File) => {
    const slug = slugify(data.name, { lower: true });
    return await brandRepositories.createBrand({ ...data, slug }, file);
}

export const updateBrand = async (id: number, data: brandInput, file: Express.Multer.File) => {
    const existingBrand = await brandRepositories.getBrandById(id);
    if (!existingBrand) {
        throw new Error("NOT_FOUND_BRAND");
    }
    const slug = slugify(data.name, { lower: true });
    return await brandRepositories.updateBrand({ id, ...data, slug }, file);
}

export const deleteBrand = async (id: number) => {
    const existingBrand = await brandRepositories.getBrandById(id);
    if (!existingBrand) {
        throw new Error("NOT_FOUND_BRAND");
    }
    return await brandRepositories.deleteBrand(id);
}

