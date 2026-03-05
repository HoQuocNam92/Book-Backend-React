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
exports.deleteBannerById = exports.updateBannerById = exports.createBanner = exports.getBannersTypes = exports.getAllBanners = void 0;
const banner_schema_1 = require("./banner.schema");
const bannerServices = __importStar(require("./banner.services.js"));
const getAllBanners = async (req, res, next) => {
    try {
        const pageNumber = parseInt(req.query.page) || 1;
        const type = req.query.type || 'all';
        const { banners, totalPages } = await bannerServices.getAllBanners(pageNumber, type);
        res.json({ banners, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBanners = getAllBanners;
const getBannersTypes = async (req, res, next) => {
    try {
        const type = req.query.type;
        if (!type) {
            return res.status(400).json({ message: 'Type query parameter is required' });
        }
        const types = await bannerServices.getBannersTypes(type);
        res.json(types);
    }
    catch (error) {
        next(error);
    }
};
exports.getBannersTypes = getBannersTypes;
const createBanner = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'Image file is required' });
        }
        const { link_url, type } = req.body;
        const validateInput = banner_schema_1.BannerSchema.parse({ link_url, type });
        const banner = await bannerServices.createNewBanner(validateInput, file);
        res.json(banner);
    }
    catch (error) {
        next(error);
    }
};
exports.createBanner = createBanner;
const updateBannerById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid banner ID' });
        }
        const { link_url, type } = req.body;
        const validateInput = banner_schema_1.BannerSchema.parse({ link_url, type });
        const banner = await bannerServices.updateBanner(id, validateInput);
        res.json(banner);
    }
    catch (error) {
        next(error);
    }
};
exports.updateBannerById = updateBannerById;
const deleteBannerById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid banner ID' });
        }
        const bannerId = await bannerServices.deleteBanner(id);
        res.json({ message: 'Banner xóa thành công ', bannerId });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBannerById = deleteBannerById;
