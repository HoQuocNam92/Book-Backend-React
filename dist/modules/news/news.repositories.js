"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsBySlug = exports.getPublishedNews = exports.getAllNews = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
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
const createNews = async (data) => {
    return prisma_js_1.default.news.create({ data });
};
exports.createNews = createNews;
const updateNews = async (id, data) => {
    return prisma_js_1.default.news.update({ where: { id }, data });
};
exports.updateNews = updateNews;
const deleteNews = async (id) => {
    return prisma_js_1.default.news.delete({ where: { id } });
};
exports.deleteNews = deleteNews;
