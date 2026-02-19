import slugify from 'slugify';
import * as productRepo from './product.repositories'
import { deleteProductInput, productInput } from './product.schema';

import cloudinary from '../../utils/cloudinary'

export const getProducts = async (pageNumber: number) => "";
export const getProductByCategory = async (category_slug: string, pageNumber: number) => await productRepo.getProductByCategory(category_slug, pageNumber);




export const createProduct = async (files: Express.Multer.File[], data: productInput) => {
    const slug = slugify(data.title, { lower: true })
    data.slug = slug
    if (data.discount_percent > 0) {
        data.sale_price = data.price * ((100 - data.discount_percent) / 100)
    }

    return await productRepo.createProduct(files, data);
}

export const deleteProduct = async (id: deleteProductInput) => {
    const isProduct = await productRepo.getProductById(Number(id.id));
    if (!isProduct) {
        throw new Error("NOT_FOUND_PRODUCT")
    }
    const data = await productRepo.getProductImageById(Number(id.id));

    for (let i = 0; i < data.length; i++) {
        const url_cloudinary = "Books-brand-logos/" + data[i].url?.split('/upload/')[1].split('/')[2].split('.')[0];
        await cloudinary.uploader.destroy(url_cloudinary)
    }
    return await productRepo.deleteProduct(id)

}


export const updateProduct = async (files: Express.Multer.File[], id: number, data: productInput) => {
    const isProduct = await productRepo.getProductById(id);
    if (!isProduct) throw new Error("NOT_FOUND_PRODUCT")
    const slug = slugify(data.title, { lower: true })
    data.slug = slug
    data.sale_price = 0
    if (data.discount_percent > 0) {
        data.sale_price = data.price * ((100 - data.discount_percent) / 100)
    }
    return await productRepo.updateProduct(files, id, data)
}