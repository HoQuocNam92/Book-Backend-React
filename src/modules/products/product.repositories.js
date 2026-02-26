import prisma from "../../utils/prisma.js";
import cloudinary from '../../utils/cloudinary.js';
export const getHomeProducts = async () => {
    const take = 12;
    const newBooksPromise = prisma.books.findMany({
        take,
        orderBy: { created_at: "desc" },
        include: {
            BookImages: {
                take: 1,
                select: { url: true },
            },
        }
    });
    const discountBooksPromise = prisma.books.findMany({
        take,
        where: {
            discount_percent: { gt: 0 },
        },
        orderBy: { discount_percent: "desc" },
        include: {
            BookImages: {
                take: 1,
                select: { url: true },
            }
        },
    });
    const bestSellerPromise = prisma.orderItems.groupBy({
        by: ["book_id"],
        _sum: { quantity: true },
        orderBy: {
            _sum: { quantity: "desc" },
        },
        take,
    });
    const [newBooks, discountBooks, bestSellerRaw] = await Promise.all([
        newBooksPromise,
        discountBooksPromise,
        bestSellerPromise,
    ]);
    const bestSellerIds = bestSellerRaw
        .map((x) => x.book_id)
        .filter((id) => id !== null);
    let bestSellerBooks = [];
    if (bestSellerIds.length > 0) {
        const books = await prisma.books.findMany({
            where: { id: { in: bestSellerIds } },
            include: {
                BookImages: {
                    take: 1,
                    select: { url: true },
                }
            },
        });
        const map = new Map(bestSellerRaw.map((x) => [x.book_id, x._sum.quantity ?? 0]));
        bestSellerBooks = books.sort((a, b) => (map.get(b.id) ?? 0) - (map.get(a.id) ?? 0));
    }
    const formatBook = (p) => ({
        ...p,
        BookImages: p.BookImages[0]?.url || null,
        price: Number(p.price),
        sale_price: Number(p.sale_price),
        discount_percent: Number(p.discount_percent),
    });
    return {
        newBooks: newBooks.map(formatBook),
        bestSellerBooks: bestSellerBooks.map(formatBook),
        discountBooks: discountBooks.map(formatBook),
    };
};
export const getProductByCategory = async (category_slug, pageNumber) => {
    const pageSize = 30;
    const skip = (pageNumber - 1) * pageSize;
    if (category_slug === "all") {
        const totalItems = await prisma.books.count();
        const products = await prisma.books.findMany({
            skip,
            take: pageSize,
            orderBy: { id: "desc" },
            select: {
                id: true,
                title: true,
                sale_price: true,
                price: true,
                status: true,
                slug: true,
                discount_percent: true,
                stock: true,
                BookImages: {
                    take: 1,
                    select: { url: true },
                },
                Categories: {
                    select: {
                        name: true,
                        slug: true,
                    },
                }
            },
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
                name: products[0].Categories?.name,
                slug: products[0].Categories?.slug,
            }
        };
    }
    const slug = category_slug;
    const parentCategory = await prisma.categories.findFirst({
        where: { slug },
        select: { id: true },
    });
    const whereConditions = {
        category_id: {
            in: (await prisma.categories.findMany({
                where: { parent_id: parentCategory?.id },
                select: { id: true },
            })).map((c) => c.id),
        },
    };
    const totalItems = await prisma.books.count({
        where: whereConditions
    });
    const products = await prisma.books.findMany({
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
                    name: true,
                    slug: true,
                },
            }
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
            name: products[0].Categories?.name,
            slug: products[0].Categories?.slug,
        }
    };
};
export const createProduct = async (files, data) => {
    const uploadedAssets = [];
    try {
        for (let i = 0; i < files.length; i++) {
            const b64 = Buffer.from(files[i].buffer).toString("base64");
            const dataURI = `data:${files[i].mimetype};base64,${b64}`;
            const uploaded = await cloudinary.uploader.upload(dataURI, { folder: "Books" });
            uploadedAssets.push({
                secure_url: uploaded.secure_url,
                public_id: uploaded.public_id,
            });
        }
        const books = await prisma.$transaction(async (tx) => {
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
        await Promise.all(uploadedAssets.map((img) => cloudinary.uploader.destroy(img.public_id)));
        throw error;
    }
};
export const deleteProduct = async ({ id }) => {
    const deletedBook = await prisma.$transaction(async (tx) => {
        const book = await tx.books.findUnique({
            where: { id },
        });
        const data = await getProductImageById(Number(id));
        for (let i = 0; i < data.length; i++) {
            const url_cloudinary = "Books/" + data[i].url?.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(url_cloudinary);
        }
        await tx.books.delete({
            where: { id }
        });
        return book;
    });
    return deletedBook;
};
export const getProductById = async (id) => {
    return await prisma.books.findUnique({
        where: { id },
        include: {
            BookImages: true,
            Categories: true,
        }
    });
};
export const getProductBySlug = async (slug) => {
    const product = await prisma.books.findFirst({
        where: { slug },
        include: {
            BookImages: true,
            Categories: true,
            Brands: true,
            BookAuthors: {
                include: {
                    Authors: true,
                }
            },
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
            BookPromotions: true
        }
    });
    if (!product)
        return null;
    const relatedBooks = await prisma.books.findMany({
        where: {
            category_id: product.category_id,
            id: { not: product.id },
        },
        take: 6,
        include: {
            BookImages: {
                take: 1,
                select: { url: true },
            }
        },
    });
    return {
        ...product,
        price: Number(product.price),
        sale_price: product.sale_price ? Number(product.sale_price) : null,
        discount_percent: product.discount_percent || 0,
        relatedBooks: relatedBooks.map((b) => ({
            ...b,
            BookImages: b.BookImages[0]?.url,
            price: Number(b.price),
            sale_price: b.sale_price ? Number(b.sale_price) : null,
            discount_percent: b.discount_percent || 0,
        })),
    };
};
export const getProductImageById = async (id) => {
    return await prisma.bookImages.findMany({
        where: {
            book_id: id
        }
    });
};
export const updateProduct = async (files, id, data) => {
    const uploadedAssets = [];
    for (let i = 0; i < files.length; i++) {
        const b64 = Buffer.from(files[i].buffer).toString("base64");
        const dataURI = `data:${files[i].mimetype};base64,${b64}`;
        const uploaded = await cloudinary.uploader.upload(dataURI, { folder: "Books" });
        uploadedAssets.push({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });
    }
    try {
        const books = await prisma.$transaction(async (tx) => {
            const book = await tx.books.update({
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
        await Promise.all(uploadedAssets.map((x) => cloudinary.uploader.destroy(x.public_id)));
        throw error;
    }
};
