"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRelated = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const PAGE_SIZE = 10;
const productRelated = async (id) => {
    const products = await prisma_1.default.books.findMany({
        where: {
            category_id: id,
            status: "active"
        },
        orderBy: { created_at: "desc" },
        include: {
            BookImages: {
                take: 1,
                select: { url: true },
            },
        },
        take: PAGE_SIZE
    });
    return {
        products: products.map((product) => ({
            ...product,
            BookImages: product.BookImages[0]?.url || null,
        })),
        total: products.length,
    };
};
exports.productRelated = productRelated;
