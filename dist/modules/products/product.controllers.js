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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductQuickActions = exports.updateProduct = exports.deleteProduct = exports.createProduct = exports.getProductByCategory = exports.getProductBySlug = exports.getProducts = void 0;
const productService = __importStar(require("./product.services.js"));
const product_schema_js_1 = require("./product.schema.js");
const getProducts = async (req, res, next) => {
    try {
        const data = await productService.getHomeProducts();
        return res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", data });
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
const getProductBySlug = async (req, res, next) => {
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
exports.getProductBySlug = getProductBySlug;
const getProductByCategory = async (req, res, next) => {
    try {
        const pageNumber = Number(req.query?.page) || 1;
        const category_slug = req.params?.category_slug || "";
        console.log("category_slug", category_slug);
        const { data, pagination, category } = await productService.getProductByCategory(category_slug, pageNumber);
        return res.status(200).json({ message: "Lấy danh sách sản phẩm thành công", data, pagination, category });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductByCategory = getProductByCategory;
const createProduct = async (req, res, next) => {
    try {
        const data = product_schema_js_1.productSchema.parse(req.body);
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
exports.createProduct = createProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const data = product_schema_js_1.deleteProductSchema.parse({ id: Number(req.params?.id) });
        const book = await productService.deleteProduct(data);
        return res.status(200).json({ message: "Xóa sản phẩm thành công", book });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
const updateProduct = async (req, res, next) => {
    try {
        const id = Number(req.params?.id);
        const data = product_schema_js_1.productSchema.parse(req.body);
        const files = req.files;
        const book = await productService.updateProduct(files, id, data);
        return res.status(200).json({ message: "Cập nhật sản phẩm thành công", book });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const updateProductQuickActions = async (req, res, next) => {
    try {
        const id = Number(req.params?.id);
        const data = req.body;
        const validatedData = product_schema_js_1.productQuickActionSchema.parse(data);
        const book = await productService.updateProductQuickActions(id, validatedData);
        return res.status(200).json({ message: "Cập nhật sản phẩm thành công", book });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProductQuickActions = updateProductQuickActions;
