"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAuthors = exports.searchCategories = exports.searchBookByCategory = exports.searchBooks = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const searchBooks = async (query) => {
    const books = await prisma_1.default.$queryRaw `
        SELECT b.id, b.title, b.slug, b.price, b.discount_percent
        FROM books b
        JOIN BookImages bimg ON b.id = bimg.book_id
        WHERE FREETEXT(b.title , ${query}) and status ='active'
        ORDER BY b.updated_at DESC
        OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY
         
    `;
    return books;
};
exports.searchBooks = searchBooks;
const searchBookByCategory = async (query) => {
    const books = await prisma_1.default.$queryRaw `
        SELECT b.id, b.title, b.slug, b.price, b.discount_percent
        FROM books b
        JOIN BookCategories bc ON b.id = bc.book_id
        JOIN categories c ON bc.category_id = c.id
        JOIN BookImages bimg ON b.id = bimg.book_id
        WHERE FREETEXT(c.name , ${query}) and b.status ='active'
        ORDER BY b.updated_at DESC
        OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY
    `;
    return books;
};
exports.searchBookByCategory = searchBookByCategory;
const searchCategories = async (query) => {
    const categories = await prisma_1.default.$queryRaw `
        SELECT c.id, c.name, c.slug
        FROM categories c
        JOIN BookCategories bc ON c.id = bc.category_id
        JOIN books b ON bc.book_id = b.id
        WHERE FREETEXT(c.name , ${query}) and b.status ='active'
        GROUP BY c.id, c.name, c.slug
        ORDER BY MAX(b.updated_at) DESC
        OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY
    `;
    return categories;
};
exports.searchCategories = searchCategories;
const searchAuthors = async (query) => {
    const authors = await prisma_1.default.$queryRaw `
        SELECT a.id, a.name, a.slug
        FROM authors a
        JOIN BookAuthors ba ON a.id = ba.author_id
        JOIN books b ON ba.book_id = b.id
        WHERE FREETEXT(a.name , ${query}) and b.status ='active'
        GROUP BY a.id, a.name, a.slug
        ORDER BY MAX(b.updated_at) DESC
        OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY
    `;
    return authors;
};
exports.searchAuthors = searchAuthors;
