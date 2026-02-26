import slugify from "slugify";
import * as productRepo from './product.repositories.js';
export const getHomeProducts = async () => await productRepo.getHomeProducts();
export const getProductByCategory = async (category_slug, pageNumber) => await productRepo.getProductByCategory(category_slug, pageNumber);
export const getProductBySlug = async (slug) => await productRepo.getProductBySlug(slug);
export const createProduct = async (files, data) => {
    const slug = slugify(data.title, { lower: true });
    data.slug = slug;
    if (data.discount_percent > 0) {
        data.sale_price = data.price * ((100 - data.discount_percent) / 100);
    }
    return await productRepo.createProduct(files, data);
};
export const deleteProduct = async (id) => {
    const isProduct = await productRepo.getProductById(Number(id.id));
    if (!isProduct) {
        throw new Error("NOT_FOUND_PRODUCT");
    }
    return await productRepo.deleteProduct(id);
};
export const updateProduct = async (files, id, data) => {
    const isProduct = await productRepo.getProductById(id);
    if (!isProduct)
        throw new Error("NOT_FOUND_PRODUCT");
    const slug = slugify(data.title, { lower: true });
    data.slug = slug;
    data.sale_price = 0;
    if (data.discount_percent > 0) {
        data.sale_price = data.price * ((100 - data.discount_percent) / 100);
    }
    return await productRepo.updateProduct(files, id, data);
};
