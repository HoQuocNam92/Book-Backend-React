"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryBySlug = exports.updateProductQuickActions = exports.updateProduct = exports.getProductImageById = exports.getProductBySlug = exports.getProductById = exports.deleteProduct = exports.createProduct = exports.getProductByCategory = exports.getHomeProducts = void 0;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const cloudinary_js_1 = __importDefault(require("../../utils/cloudinary.js"));
const getHomeProducts = async () => {
    const take = 12;
    const newBooksPromise = prisma_js_1.default.books.findMany({
        take,
        orderBy: { created_at: "desc" },
        include: {
            BookImages: {
                take: 1,
                select: { url: true },
            },
        },
        where: {
            status: "active"
        }
    });
    const discountBooksPromise = prisma_js_1.default.books.findMany({
        take,
        where: {
            discount_percent: { gt: 0 },
            sale_price: { gt: 0 },
            status: "active"
        },
        orderBy: { discount_percent: "desc" },
        include: {
            BookImages: {
                take: 1,
                select: { url: true },
            }
        },
    });
    const featuredPromise = prisma_js_1.default.books.findMany({
        orderBy: {
            created_at: "desc",
        },
        take,
        where: {
            isFeatured: true,
            status: "active"
        },
        include: {
            BookImages: {
                take: 1,
                select: { url: true },
            }
        },
    });
    const [newBooks, discountBooks, featuredBooks] = await Promise.all([
        newBooksPromise,
        discountBooksPromise,
        featuredPromise,
    ]);
    const formatBook = (p) => ({
        ...p,
        BookImages: p.BookImages[0]?.url || null,
        price: Number(p.price),
        sale_price: Number(p.sale_price),
        discount_percent: Number(p.discount_percent),
    });
    return {
        newBooks: newBooks.map(formatBook),
        featuredBooks: featuredBooks.map(formatBook),
        discountBooks: discountBooks.map(formatBook),
    };
};
exports.getHomeProducts = getHomeProducts;
const getProductByCategory = async (category_slug, pageNumber) => {
    const pageSize = 30;
    const skip = (pageNumber - 1) * pageSize;
    let whereConditions = {};
    let parentCategory;
    const slug = category_slug === "all" ? undefined : category_slug;
    if (slug) {
        parentCategory = await prisma_js_1.default.categories.findFirst({
            where: { slug },
            select: { id: true },
        });
        whereConditions = {
            category_id: {
                in: (await prisma_js_1.default.categories.findMany({
                    where: { parent_id: parentCategory?.id },
                    select: { id: true },
                })).map((c) => c.id),
            },
        };
    }
    const totalItems = await prisma_js_1.default.books.count({
        where: whereConditions
    });
    const products = await prisma_js_1.default.books.findMany({
        skip,
        take: pageSize,
        orderBy: { id: "desc" },
        select: {
            id: true,
            title: true,
            sale_price: true,
            price: true,
            slug: true,
            status: true,
            stock: true,
            discount_percent: true,
            BookImages: {
                take: 1,
                select: { url: true },
            },
            Categories: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
            Brands: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                }
            },
            isFeatured: true,
        },
        where: whereConditions,
    });
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
        data: products.map((p) => ({
            ...p,
            BookImages: p.BookImages[0]?.url || null,
            price: Number(p.price),
            sale_price: Number(p.sale_price),
            discount_percent: Number(p.discount_percent),
        })),
        pagination: {
            page: pageNumber,
            pageSize,
            totalItems,
            totalPages,
        },
        category: {
            name: products[0]?.Categories?.name || null,
            slug: products[0]?.Categories?.slug || null,
        }
    };
};
exports.getProductByCategory = getProductByCategory;
const createProduct = async (files, data) => {
    const uploadedAssets = [];
    try {
        for (let i = 0; i < files.length; i++) {
            const b64 = Buffer.from(files[i].buffer).toString("base64");
            const dataURI = `data:${files[i].mimetype};base64,${b64}`;
            const uploaded = await cloudinary_js_1.default.uploader.upload(dataURI, { folder: "Books" });
            uploadedAssets.push({
                secure_url: uploaded.secure_url,
                public_id: uploaded.public_id,
            });
        }
        const books = await prisma_js_1.default.$transaction(async (tx) => {
            const book = await tx.books.create({
                data: {
                    title: data.title,
                    price: data.price,
                    stock: data.stock,
                    slug: data.slug,
                    brand_id: data.brand_id,
                    category_id: data.category_id,
                    discount_percent: data.discount_percent,
                    description: data.description,
                    sale_price: data.sale_price,
                    status: data.status,
                },
            });
            if (data.attri?.length) {
                await tx.bookAttributes.createMany({
                    data: data.attri.map((e) => ({
                        book_id: book.id,
                        attr_key: e.key,
                        attr_value: e.value,
                    })),
                });
            }
            await tx.bookImages.createMany({
                data: uploadedAssets.map((url) => ({
                    book_id: book.id,
                    url: url.secure_url
                }))
            });
            if (data.content?.length) {
                await tx.bookPromotions.create({
                    data: {
                        book_id: book.id,
                        content: data.content,
                    },
                });
            }
            return book;
        });
        return books;
    }
    catch (error) {
        await Promise.all(uploadedAssets.map((img) => cloudinary_js_1.default.uploader.destroy(img.public_id)));
        throw error;
    }
};
exports.createProduct = createProduct;
const deleteProduct = async ({ id }) => {
    const deletedBook = await prisma_js_1.default.$transaction(async (tx) => {
        const book = await tx.books.findUnique({
            where: { id },
        });
        const data = await (0, exports.getProductImageById)(Number(id));
        for (let i = 0; i < data.length; i++) {
            const url_cloudinary = "Books/" + data[i].url?.split('/').slice(-1)[0].split('.')[0];
            await cloudinary_js_1.default.uploader.destroy(url_cloudinary);
        }
        await tx.books.delete({
            where: { id }
        });
        return book;
    });
    return deletedBook;
};
exports.deleteProduct = deleteProduct;
const getProductById = async (id) => {
    return await prisma_js_1.default.books.findUnique({
        where: { id },
        include: {
            BookImages: true,
            Categories: true,
        }
    });
};
exports.getProductById = getProductById;
const getProductBySlug = async (slug) => {
    const product = await prisma_js_1.default.books.findFirst({
        where: { slug },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            status: true,
            stock: true,
            slug: true,
            sale_price: true,
            discount_percent: true,
            isFeatured: true,
            BookImages: true,
            Categories: true,
            Brands: true,
            BookAttributes: true,
            Reviews: {
                include: {
                    Users: {
                        select: { name: true, id: true }
                    }
                },
                orderBy: { create_at: 'desc' },
                take: 20,
            },
            BookPromotions: true,
            BookAuthors: {
                include: {
                    Authors: true,
                },
            }
        }
    });
    if (!product)
        return null;
    // const relatedBooks = await prisma.books.findMany({
    //     where: {
    //         category_id: product.category_id,
    //         id: { not: product.id },
    //     },
    //     take: 6,
    //     include: {
    //         BookImages: {
    //             take: 1,
    //             select: { url: true },
    //         }
    //     },
    // });
    //   relatedBooks: relatedBooks.map((b: any) => ({
    //             ...b,
    //             BookImages: b.BookImages[0]?.url,
    //             price: Number(b.price),
    //             sale_price: b.sale_price ? Number(b.sale_price) : null,
    //             discount_percent: b.discount_percent || 0,
    //         })),
    return {
        ...product,
        price: Number(product.price),
        sale_price: product.sale_price ? Number(product.sale_price) : null,
        discount_percent: product.discount_percent || 0,
        BookImages: product.BookImages
    };
};
exports.getProductBySlug = getProductBySlug;
const getProductImageById = async (id) => {
    return await prisma_js_1.default.bookImages.findMany({
        where: {
            book_id: id
        }
    });
};
exports.getProductImageById = getProductImageById;
const updateProduct = async (files, id, data) => {
    const uploadedAssets = [];
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const b64 = Buffer.from(files[i].buffer).toString("base64");
            const dataURI = `data:${files[i].mimetype};base64,${b64}`;
            const uploaded = await cloudinary_js_1.default.uploader.upload(dataURI, { folder: "Books" });
            uploadedAssets.push({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });
        }
    }
    try {
        const books = await prisma_js_1.default.$transaction(async (tx) => {
            const book = await tx.books.update({
                data: {
                    title: data.title,
                    price: data.price,
                    stock: data.stock,
                    slug: data.slug,
                    Brands: {
                        connect: { id: data.brand_id }
                    },
                    Categories: {
                        connect: { id: data.category_id }
                    },
                    discount_percent: data.discount_percent,
                    description: data.description,
                    sale_price: data.sale_price,
                    isFeatured: data.is_featured,
                    status: data.status,
                    updated_at: new Date(),
                },
                where: {
                    id
                }
            });
            if (data.attri?.length) {
                await tx.bookAttributes.createMany({
                    data: data.attri.map((e) => ({
                        book_id: id,
                        attr_key: e.key,
                        attr_value: e.value,
                    })),
                });
            }
            await tx.bookImages.createMany({
                data: uploadedAssets.map((url) => ({
                    book_id: book.id,
                    url: url.secure_url
                }))
            });
            if (data.content?.length) {
                await tx.bookPromotions.create({
                    data: {
                        book_id: id,
                        content: data.content,
                    },
                });
            }
            return id;
        });
        return books;
    }
    catch (error) {
        await Promise.all(uploadedAssets.map((x) => cloudinary_js_1.default.uploader.destroy(x.public_id)));
        throw error;
    }
};
exports.updateProduct = updateProduct;
const updateProductQuickActions = async (id, data) => {
    const updatedData = {};
    if (data.is_featured !== undefined) {
        updatedData.isFeatured = data.is_featured;
    }
    if (data.status !== undefined) {
        updatedData.status = data.status;
    }
    return await prisma_js_1.default.books.update({
        where: { id },
        data: updatedData,
    });
};
exports.updateProductQuickActions = updateProductQuickActions;
const getCategoryBySlug = async (slug) => {
    return await prisma_js_1.default.categories.findFirst({
        where: { slug },
        select: {
            id: true,
        }
    });
};
exports.getCategoryBySlug = getCategoryBySlug;
