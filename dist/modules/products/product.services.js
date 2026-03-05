"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductQuickActions = exports.updateProduct = exports.deleteProduct = exports.createProduct = exports.getProductBySlug = exports.getProductByCategory = exports.getHomeProducts = void 0;
const slugify_1 = __importDefault(require("slugify"));
const productRepo = __importStar(require("./product.repositories.js"));
const redis_js_1 = __importDefault(require("../../utils/redis.js"));
const getHomeProducts = async () => await productRepo.getHomeProducts();
exports.getHomeProducts = getHomeProducts;
const getProductByCategory = async (category_slug, pageNumber) => {
    const cacheKey = `products:${category_slug || "all"}:page:${pageNumber}`;
    const cachedData = await redis_js_1.default.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    const { data, pagination, category } = await productRepo.getProductByCategory(category_slug, pageNumber);
    await redis_js_1.default.setEx(cacheKey, 3600, JSON.stringify({ data, pagination, category }));
    return { data, pagination, category };
};
exports.getProductByCategory = getProductByCategory;
const getProductBySlug = async (slug) => await productRepo.getProductBySlug(slug);
exports.getProductBySlug = getProductBySlug;
const createProduct = async (files, data) => {
    const slug = (0, slugify_1.default)(data.title, { lower: true });
    data.slug = slug;
    if (data.discount_percent > 0) {
        data.sale_price = data.price * ((100 - data.discount_percent) / 100);
    }
    const keys = await redis_js_1.default.keys("products:*");
    if (keys.length > 0) {
        await redis_js_1.default.del(keys);
    }
    return await productRepo.createProduct(files, data);
};
exports.createProduct = createProduct;
const deleteProduct = async (id) => {
    const isProduct = await productRepo.getProductById(Number(id.id));
    if (!isProduct) {
        throw new Error("NOT_FOUND_PRODUCT");
    }
    const keys = await redis_js_1.default.keys("products:*");
    if (keys.length > 0) {
        await redis_js_1.default.del(keys);
    }
    return await productRepo.deleteProduct(id);
};
exports.deleteProduct = deleteProduct;
const updateProduct = async (files, id, data) => {
    const isProduct = await productRepo.getProductById(id);
    if (!isProduct)
        throw new Error("NOT_FOUND_PRODUCT");
    const slug = (0, slugify_1.default)(data.title, { lower: true });
    data.slug = slug;
    data.sale_price = 0;
    if (data.discount_percent > 0) {
        data.sale_price = data.price * ((100 - data.discount_percent) / 100);
    }
    const keys = await redis_js_1.default.keys("products:*");
    if (keys.length > 0) {
        await redis_js_1.default.del(keys);
    }
    return await productRepo.updateProduct(files, id, data);
};
exports.updateProduct = updateProduct;
const updateProductQuickActions = async (id, data) => {
    const isProduct = await productRepo.getProductById(id);
    if (!isProduct)
        throw new Error("NOT_FOUND_PRODUCT");
    const keys = await redis_js_1.default.keys("products:*");
    if (keys.length > 0) {
        await redis_js_1.default.del(keys);
    }
    return await productRepo.updateProductQuickActions(id, data);
};
exports.updateProductQuickActions = updateProductQuickActions;
