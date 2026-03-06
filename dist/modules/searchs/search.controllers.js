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
exports.getSearchAuthors = exports.getSearchCategories = exports.getSearchBookByCategory = exports.getSearchBooks = void 0;
const searchServices = __importStar(require("./search.services.js"));
const getSearchBooks = async (req, res, next) => {
    try {
        const { key } = req.query;
        const books = await searchServices.searchBooks(key);
        return res.json({ message: 'Tìm kiếm thành công', data: books });
    }
    catch (error) {
        next(error);
    }
};
exports.getSearchBooks = getSearchBooks;
const getSearchBookByCategory = async (req, res, next) => {
    try {
        const { key } = req.query;
        const books = await searchServices.searchBookByCategory(key);
        return res.json({ message: 'Tìm kiếm thành công', data: books });
    }
    catch (error) {
        next(error);
    }
};
exports.getSearchBookByCategory = getSearchBookByCategory;
const getSearchCategories = async (req, res, next) => {
    try {
        const { key } = req.query;
        const categories = await searchServices.searchCategories(key);
        return res.json({ message: 'Tìm kiếm thành công', data: categories });
    }
    catch (error) {
        next(error);
    }
};
exports.getSearchCategories = getSearchCategories;
const getSearchAuthors = async (req, res, next) => {
    try {
        const { key } = req.query;
        const authors = await searchServices.searchAuthors(key);
        return res.json({ message: 'Tìm kiếm thành công', data: authors });
    }
    catch (error) {
        next(error);
    }
};
exports.getSearchAuthors = getSearchAuthors;
