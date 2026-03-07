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
exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsBySlug = exports.getPublishedNews = exports.getAllNews = void 0;
const newsServices = __importStar(require("./news.services.js"));
const news_schema_js_1 = require("./news.schema.js");
const getAllNews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { news, totalPages } = await newsServices.getAllNews(page);
        return res.json({ message: 'Lấy tin tức thành công', data: news, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllNews = getAllNews;
const getPublishedNews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { news, totalPages } = await newsServices.getPublishedNews(page);
        return res.json({ message: 'Lấy tin tức thành công', data: news, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.getPublishedNews = getPublishedNews;
const getNewsBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const news = await newsServices.getNewsBySlug(slug);
        if (!news) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }
        return res.json({ message: 'Lấy tin tức thành công', data: news });
    }
    catch (error) {
        next(error);
    }
};
exports.getNewsBySlug = getNewsBySlug;
const createNews = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            throw new Error('THUMBNAIL_REQUIRED');
        }
        const validateData = news_schema_js_1.newsSchema.parse(req.body);
        const news = await newsServices.createNews(validateData, file);
        return res.status(201).json({ message: 'Tạo tin tức thành công', data: news });
    }
    catch (error) {
        next(error);
    }
};
exports.createNews = createNews;
const updateNews = async (req, res, next) => {
    try {
        const file = req.file;
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ message: 'ID không hợp lệ' });
        if (!file) {
            throw new Error('THUMBNAIL_REQUIRED');
        }
        const validateData = news_schema_js_1.newsSchema.parse(req.body);
        const news = await newsServices.updateNews(id, validateData, file);
        return res.json({ message: 'Cập nhật tin tức thành công', data: news });
    }
    catch (error) {
        next(error);
    }
};
exports.updateNews = updateNews;
const deleteNews = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ message: 'ID không hợp lệ' });
        await newsServices.deleteNews(id);
        return res.json({ message: 'Xóa tin tức thành công' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteNews = deleteNews;
