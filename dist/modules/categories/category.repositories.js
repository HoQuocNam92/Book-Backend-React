"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryById = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategories = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const getAllCategories = async () => {
    return await prisma_js_1.default.categories.findMany();
};
exports.getAllCategories = getAllCategories;
const createCategory = async (data) => {
    return await prisma_js_1.default.categories.create({
        data: {
            name: data.name,
            slug: data.slug,
            parent_id: data?.parent_id,
        }
    });
};
exports.createCategory = createCategory;
const updateCategory = async (id, data) => {
    return await prisma_js_1.default.categories.update({
        where: {
            id: id,
        },
        data: {
            name: data.name,
            slug: data.slug,
            parent_id: data?.parent_id,
        }
    });
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    return await prisma_js_1.default.categories.delete({
        where: {
            id: id,
        }
    });
};
exports.deleteCategory = deleteCategory;
const getCategoryById = async (id) => {
    return await prisma_js_1.default.categories.findUnique({
        where: {
            id: id,
        }
    });
};
exports.getCategoryById = getCategoryById;
