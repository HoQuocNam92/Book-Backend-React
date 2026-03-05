"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrandById = exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getAllBrands = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const cloudinary_js_1 = __importDefault(require("../../utils/cloudinary.js"));
const pageSize = 10;
const getAllBrands = async (page) => {
    const skip = (page - 1) * pageSize;
    const brands = await prisma_js_1.default.brands.findMany({
        skip,
        take: pageSize,
    });
    const totalPages = Math.ceil((await prisma_js_1.default.brands.count()) / pageSize);
    return {
        brands,
        totalPages
    };
};
exports.getAllBrands = getAllBrands;
const createBrand = async (data, file) => {
    const uploadLogo = {};
    try {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const uploadResponse = await cloudinary_js_1.default.uploader.upload(dataURI, {
            folder: 'Books-brand-logos',
        });
        uploadLogo.public_id = uploadResponse.public_id;
        uploadLogo.secure_url = uploadResponse.secure_url;
        const brand = await prisma_js_1.default.$transaction(async (x) => {
            const newBrand = await x.brands.create({
                data: { name: data.name, description: data.description, logo_url: uploadLogo.secure_url, slug: data.slug }
            });
            return newBrand;
        });
        return brand;
    }
    catch (error) {
        if (uploadLogo.public_id) {
            await cloudinary_js_1.default.uploader.destroy(uploadLogo.public_id);
        }
        throw new Error("UPLOAD_LOGO_FAILED");
    }
};
exports.createBrand = createBrand;
const updateBrand = async (info, file) => {
    const uploadLogo = {};
    try {
        const existingBrand = await prisma_js_1.default.brands.findUnique({ where: { id: info.id } });
        if (!existingBrand) {
            throw new Error("NOT_FOUND_BRAND");
        }
        if (file) {
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = `data:${file.mimetype};base64,${b64}`;
            const uploadResponse = await cloudinary_js_1.default.uploader.upload(dataURI, {
                folder: 'Books-brand-logos',
            });
            uploadLogo.public_id = uploadResponse.public_id;
            uploadLogo.secure_url = uploadResponse.secure_url;
            const brand = await prisma_js_1.default.$transaction(async (x) => {
                const updatedBrand = await x.brands.update({
                    where: { id: info.id },
                    data: { name: info.name, description: info.description, logo_url: uploadLogo.secure_url, slug: info.slug }
                });
                return updatedBrand;
            });
            await cloudinary_js_1.default.uploader.destroy("Books-brand-logos/" + existingBrand?.logo_url.split('/').slice(-1)[0].split('.')[0]);
            return brand;
        }
        const brand = await prisma_js_1.default.$transaction(async (x) => {
            const updatedBrand = await x.brands.update({
                where: { id: info.id },
                data: { name: info.name, description: info.description, logo_url: info.logo_url, slug: info.slug }
            });
            return updatedBrand;
        });
        return brand;
    }
    catch (error) {
        if (uploadLogo.public_id) {
            await cloudinary_js_1.default.uploader.destroy(uploadLogo.public_id);
        }
        throw error;
    }
};
exports.updateBrand = updateBrand;
const deleteBrand = async (id) => {
    return await prisma_js_1.default.$transaction(async (x) => {
        const brand = await x.brands.findUnique({ where: { id } });
        if (!brand) {
            throw new Error("NOT_FOUND_BRAND");
        }
        if (brand?.logo_url) {
            const publicId = "Books-brand-logos/" + brand.logo_url.split('/').slice(-1)[0].split('.')[0];
            await cloudinary_js_1.default.uploader.destroy(publicId);
        }
        await x.brands.delete({ where: { id } });
    });
};
exports.deleteBrand = deleteBrand;
const getBrandById = async (id) => {
    return await prisma_js_1.default.brands.findUnique({
        where: { id }
    });
};
exports.getBrandById = getBrandById;
