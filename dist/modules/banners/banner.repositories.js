"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBannerById = exports.updateBannerById = exports.deleteBannerById = exports.createBanner = exports.getBannersTypes = exports.getBanners = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const cloudinary_js_1 = __importDefault(require("../../utils/cloudinary.js"));
const pageSize = 10;
const getBanners = async (pageNumber, type) => {
    const skip = (pageNumber - 1) * pageSize;
    const totalPages = Math.ceil(await prisma_1.default.banners.count() / pageSize);
    const banners = await prisma_1.default.banners.findMany({
        skip,
        take: pageSize,
        orderBy: {
            created_at: 'desc'
        }
    });
    return { banners, totalPages };
};
exports.getBanners = getBanners;
const getBannersTypes = async (type) => {
    const banners = await prisma_1.default.banners.findMany({
        where: {
            type: type
        }
    });
    return banners;
};
exports.getBannersTypes = getBannersTypes;
const createBanner = async (data, file) => {
    const banner = await prisma_1.default.$transaction(async (tx) => {
        let image = null;
        try {
            const base64 = Buffer.from(file.buffer).toString('base64');
            const filePath = `data:${file.mimetype};base64,${base64}`;
            image = await cloudinary_js_1.default.uploader.upload(filePath);
            const newBanner = await tx.banners.create({
                data: {
                    link_url: data.link_url,
                    image_url: image.secure_url,
                    type: data.type
                }
            });
            return newBanner;
        }
        catch (error) {
            if (image) {
                await cloudinary_js_1.default.uploader.destroy(image.public_id);
            }
            throw error;
        }
    });
    return banner;
};
exports.createBanner = createBanner;
const deleteBannerById = async (id) => {
    await prisma_1.default.banners.delete({
        where: {
            id
        }
    });
};
exports.deleteBannerById = deleteBannerById;
const updateBannerById = async (id, data, file, type) => {
    const banner = await prisma_1.default.$transaction(async (tx) => {
        let image = null;
        try {
            if (file) {
                const base64 = Buffer.from(file.buffer).toString('base64');
                const filePath = `data:${file.mimetype};base64,${base64}`;
                image = await cloudinary_js_1.default.uploader.upload(filePath);
            }
            const whereCondition = image ? image.secure_url : undefined;
            const updatedBanner = await tx.banners.update({
                where: {
                    id
                },
                data: {
                    link_url: data.link_url,
                    image_url: whereCondition,
                    type: data.type
                }
            });
            return updatedBanner;
        }
        catch (error) {
            if (image) {
                await cloudinary_js_1.default.uploader.destroy(image.public_id);
            }
            throw error;
        }
    });
    return banner;
};
exports.updateBannerById = updateBannerById;
const getBannerById = async (id) => {
    const banner = await prisma_1.default.banners.findUnique({
        where: { id }
    });
    return banner;
};
exports.getBannerById = getBannerById;
