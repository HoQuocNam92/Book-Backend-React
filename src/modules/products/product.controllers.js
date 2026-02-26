import * as productService from './product.services.js';
import { deleteProductSchema, productSchema } from './product.schema.js';
import redisClient from '../../utils/redis.js';
export const getProducts = async (req, res, next) => {
    try {
        const data = await productService.getHomeProducts();
        return res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", data });
    }
    catch (error) {
        next(error);
    }
};
export const getProductBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const data = await productService.getProductBySlug(slug);
        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        return res.status(200).json({ message: "Lấy sản phẩm thành công", data });
    }
    catch (error) {
        next(error);
    }
};
export const getProductByCategory = async (req, res, next) => {
    try {
        const pageNumber = Number(req.query?.page) || 1;
        const cacheKey = `products:${req.params?.category_slug || "all"}:page:${pageNumber}`;
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({ message: "Lấy danh sách sản phẩm thành công (cached)", ...JSON.parse(cachedData) });
        }
        const category_slug = req.params?.category_slug || "";
        const { data, pagination, category } = await productService.getProductByCategory(category_slug, pageNumber);
        await redisClient.setEx(cacheKey, 3600, JSON.stringify({ data, pagination, category }));
        return res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", data, pagination, category });
    }
    catch (error) {
        next(error);
    }
};
export const createProduct = async (req, res, next) => {
    try {
        const data = productSchema.parse(req.body);
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(403).json({ message: "Vui lòng thêm ảnh" });
        }
        const book = await productService.createProduct(files, data);
        return res.status(200).json({ message: "Tạo sản phẩm thành công", book });
    }
    catch (error) {
        next(error);
    }
};
export const deleteProduct = async (req, res, next) => {
    try {
        const data = deleteProductSchema.parse({ id: Number(req.params?.id) });
        const book = await productService.deleteProduct(data);
        return res.status(200).json({ message: "Xóa sản phẩm thành công", book });
    }
    catch (error) {
        next(error);
    }
};
export const updateProduct = async (req, res, next) => {
    try {
        const id = Number(req.params?.id);
        const data = productSchema.parse(req.body);
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(403).json({ message: "Vui lòng thêm ảnh" });
        }
        const book = await productService.updateProduct(files, id, data);
        return res.status(200).json({ message: "Cập nhật sản phẩm thành công", book });
    }
    catch (error) {
        next(error);
    }
};
