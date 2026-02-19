import prisma from "../../utils/prisma";
import { deleteProductInput, productInput } from "./product.schema";

import cloudinary from '../../utils/cloudinary'

export const getHomeProducts = async () => {
    const take = 12;

    const newBooksPromise = prisma.books.findMany({
        take,
        orderBy: { created_at: "desc" },
        include: {
            BookImages: {
                take: 1,
                select: { url: true },
            }
        },
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
        .filter((id): id is number => id !== null);


    let bestSellerBooks: any[] = [];

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

        const map = new Map(
            bestSellerRaw.map((x) => [x.book_id, x._sum.quantity])
        );

        bestSellerBooks = books.sort(
            (a, b) => (map.get(b.id) ?? 0) - (map.get(a.id) ?? 0)
        );
    }

    const formatBook = (p: any) => ({
        ...p,
        BookImages: p.BookImages.url,
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



export const getProductByCategory = async (category_slug: string | undefined, pageNumber: number,) => {
    const pageSize = 30
    const skip = (pageNumber - 1) * pageSize;


    const findFirstCategory = await prisma.categories.findFirst({
        select: { slug: true },
        where: { parent_id: null },
    });

    const slug = category_slug || findFirstCategory?.slug;

    const parentCategory = await prisma.categories.findFirst({
        where: { slug },
        select: { id: true },
    });

    const whereConditions = {
        category_id: {
            in: (
                await prisma.categories.findMany({
                    where: { parent_id: parentCategory?.id },
                    select: { id: true },
                })
            ).map((c: any) => c.id),
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
        data: products.map((p: any) => ({
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


export const createProduct = async (files: Express.Multer.File[], data: productInput) => {
    const uploadedAssets: { secure_url: string; public_id: string }[] = [];

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
        const books = await prisma.$transaction(async (tx: any) => {

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
                data: uploadedAssets.map((url) => (
                    {
                        book_id: book.id,
                        url: url.secure_url
                    }
                ))
            })



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
    } catch (error) {
        await Promise.all(
            uploadedAssets.map((img) =>
                cloudinary.uploader.destroy(img.public_id)
            )
        );
        throw error
    }

};





export const deleteProduct = async ({ id }: deleteProductInput) => {
    return await prisma.books.delete({
        where: { id }
    })
}

export const getProductById = async (id: number) => {
    return await prisma.books.findUnique({
        where: { id },
        include: {
            BookImages: true,
            Categories: true,
        }
    })
}

export const getProductImageById = async (id: number) => {
    return await prisma.bookImages.findMany({
        where: {
            book_id: id
        }
    })
}


export const updateProduct = async (files: Express.Multer.File[], id: number, data: productInput) => {
    const uploadedAssets: { secure_url: string; public_id: string }[] = [];

    for (let i = 0; i < files.length; i++) {
        const b64 = Buffer.from(files[i].buffer).toString("base64");
        const dataURI = `data:${files[i].mimetype};base64,${b64}`;
        const uploaded = await cloudinary.uploader.upload(dataURI, { folder: "Books" });
        uploadedAssets.push({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });


    }
    try {
        const books = await prisma.$transaction(async (tx: any) => {
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
            },
            );

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
                data: uploadedAssets.map((url) => (
                    {
                        book_id: book.id,
                        url: url.secure_url
                    }
                ))
            })

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
        return books
    } catch (error) {
        await Promise.all(
            uploadedAssets.map((x) =>
                cloudinary.uploader.destroy(x.public_id)
            )
        )
        throw error
    }
}