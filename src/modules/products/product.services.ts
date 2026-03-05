import slugify from "slugify"

import * as productRepo from './product.repositories.js'
import { deleteProductInput, productInput, ProductQuickActionsInput } from './product.schema.js';
import redisClient from "../../utils/redis.js";

export const getHomeProducts = async () => await productRepo.getHomeProducts();
export const getProductByCategory = async (category_slug: string, pageNumber: number) => {
    const cacheKey = `products:${category_slug || "all"}:page:${pageNumber}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    if (category_slug !== "all") {
        const isCategory = await productRepo.getCategoryBySlug(category_slug);
        if (!isCategory) {
            throw new Error("NOT_FOUND_CATEGORY")
        }
    }

    const { data, pagination, category } = await productRepo.getProductByCategory(category_slug, pageNumber);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify({ data, pagination, category }));
    return { data, pagination, category };
}



export const getProductBySlug = async (slug: string) => await productRepo.getProductBySlug(slug);



export const createProduct = async (files: Express.Multer.File[], data: productInput) => {

    const slug = slugify(data.title, { lower: true })
    data.slug = slug
    if (data.discount_percent > 0) {
        data.sale_price = data.price * ((100 - data.discount_percent) / 100)
    }
    const keys = await redisClient.keys("products:*");
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
    return await productRepo.createProduct(files, data);
}

export const deleteProduct = async (id: deleteProductInput) => {
    const isProduct = await productRepo.getProductById(Number(id.id));
    if (!isProduct) {
        throw new Error("NOT_FOUND_PRODUCT")
    }
    const keys = await redisClient.keys("products:*");
    if (keys.length > 0) {
        await redisClient.del(keys);
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
    const keys = await redisClient.keys("products:*");
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
    return await productRepo.updateProduct(files, id, data)
}

export const updateProductQuickActions = async (id: number, data: ProductQuickActionsInput) => {
    const isProduct = await productRepo.getProductById(id);
    if (!isProduct) throw new Error("NOT_FOUND_PRODUCT")
    const keys = await redisClient.keys("products:*");
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
    return await productRepo.updateProductQuickActions(id, data)
}
