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
exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsBySlug = exports.getPublishedNews = exports.getAllNews = void 0;
const slugify_1 = __importDefault(require("slugify"));
const newsRepository = __importStar(require("./news.repositories.js"));
const getAllNews = async (page = 1) => {
    return newsRepository.getAllNews(page);
};
exports.getAllNews = getAllNews;
const getPublishedNews = async (page = 1) => {
    return newsRepository.getPublishedNews(page);
};
exports.getPublishedNews = getPublishedNews;
const getNewsBySlug = async (slug) => {
    return newsRepository.getNewsBySlug(slug);
};
exports.getNewsBySlug = getNewsBySlug;
const createNews = async (data, file) => {
    const slug = (0, slugify_1.default)(data.title, {
        lower: true,
    });
    return newsRepository.createNews({ ...data, slug }, file);
};
exports.createNews = createNews;
const updateNews = async (id, data, file) => {
    const news = await newsRepository.getNewsById(id);
    if (!news) {
        throw new Error('NOT_FOUND_NEWS');
    }
    const slug = (0, slugify_1.default)(data.title, {
        lower: true,
    });
    return newsRepository.updateNews(id, { ...data, slug }, file);
};
exports.updateNews = updateNews;
const deleteNews = async (id) => {
    const news = await newsRepository.getNewsById(id);
    if (!news) {
        throw new Error('NOT_FOUND_NEWS');
    }
    return newsRepository.deleteNews(id);
};
exports.deleteNews = deleteNews;
