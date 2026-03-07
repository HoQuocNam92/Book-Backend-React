"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsById = exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsBySlug = exports.getPublishedNews = exports.getAllNews = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const cloudinary_js_1 = __importDefault(require("../../utils/cloudinary.js"));
const getAllNews = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [news, total] = await Promise.all([
        prisma_js_1.default.news.findMany({
            orderBy: { created_at: 'desc' },
            skip,
            take: limit,
        }),
        prisma_js_1.default.news.count(),
    ]);
    return { news, totalPages: Math.ceil(total / limit) };
};
exports.getAllNews = getAllNews;
const getPublishedNews = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [news, total] = await Promise.all([
        prisma_js_1.default.news.findMany({
            where: { is_published: true },
            orderBy: { created_at: 'desc' },
            skip,
            take: limit,
        }),
        prisma_js_1.default.news.count({ where: { is_published: true } }),
    ]);
    return { news, totalPages: Math.ceil(total / limit) };
};
exports.getPublishedNews = getPublishedNews;
const getNewsBySlug = async (slug) => {
    return prisma_js_1.default.news.findUnique({ where: { slug } });
};
exports.getNewsBySlug = getNewsBySlug;
const createNews = async (data, file) => {
    return await prisma_js_1.default.$transaction(async (prisma) => {
        let uploadResult;
        try {
            const base64 = Buffer.from(file.buffer).toString('base64');
            const uri = `data:${file.mimetype};base64,${base64}`;
            uploadResult = await cloudinary_js_1.default.uploader.upload(uri, {
                folder: 'alphaBooks/news',
                public_id: `${Date.now()}-${file.originalname}`,
            });
            const news = await prisma.news.create({
                data: {
                    ...data, thumbnail: uploadResult?.secure_url
                }
            });
            return news;
        }
        catch (error) {
            if (uploadResult && uploadResult.public_id) {
                await cloudinary_js_1.default.uploader.destroy(uploadResult.public_id);
            }
            throw error;
        }
    });
};
exports.createNews = createNews;
const updateNews = async (id, data, file) => {
    return await prisma_js_1.default.$transaction(async (prisma) => {
        let uploadResult;
        try {
            if (file) {
                const base64 = Buffer.from(file.buffer).toString('base64');
                const uri = `data:${file.mimetype};base64,${base64}`;
                uploadResult = await cloudinary_js_1.default.uploader.upload(uri, {
                    folder: 'alphaBooks/news',
                    public_id: `${Date.now()}-${file.originalname}`,
                });
                ;
            }
            return prisma.news.update({
                where: { id }, data: {
                    ...data, thumbnail: file ? uploadResult?.secure_url : undefined
                }
            });
        }
        catch (error) {
            if (uploadResult && uploadResult.public_id) {
                await cloudinary_js_1.default.uploader.destroy(uploadResult.public_id);
            }
            throw error;
        }
    });
};
exports.updateNews = updateNews;
const deleteNews = async (id) => {
    return prisma_js_1.default.news.delete({ where: { id } });
};
exports.deleteNews = deleteNews;
const getNewsById = async (id) => {
    return prisma_js_1.default.news.findUnique({ where: { id } });
};
exports.getNewsById = getNewsById;
