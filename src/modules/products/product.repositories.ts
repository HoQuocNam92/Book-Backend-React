import prisma from "../../utils/prisma.js";
import { deleteProductInput, productInput, ProductQuickActionsInput } from "./product.schema.js";

import cloudinary from '../../utils/cloudinary.js'

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
        },
        where: {
            status: "active"
        }
    });

    const discountBooksPromise = prisma.books.findMany({
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

    const featuredPromise = prisma.books.findMany({
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



    const formatBook = (p: any) => ({
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



export const getProductByCategory = async (category_slug: string | undefined, pageNumber: number,) => {
    const pageSize = 30
    const skip = (pageNumber - 1) * pageSize;
    let whereConditions = {};
    let parentCategory;
    const slug = category_slug === "all" ? undefined : category_slug;
    if (slug) {
        parentCategory = await prisma.categories.findFirst({
            where: { slug },
            select: { id: true },
        });
        whereConditions = {
            category_id: {
                in: (
                    await prisma.categories.findMany({
                        where: { parent_id: parentCategory?.id },
                        select: { id: true },
                    })
                ).map((c: any) => c.id),
            },
        };
    }

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
            name: products[0]?.Categories?.name || null,
            slug: products[0]?.Categories?.slug || null,
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
                    status: data.status,
                },
            });

            if (data.attri?.length) {
                await tx.bookAttributes.createMany({
                    data: data.attri.map((e: any) => ({
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
    const deletedBook = await prisma.$transaction(async (tx: any) => {
        const book = await tx.books.findUnique({
            where: { id },
        });
        const data = await getProductImageById(Number(id));

        for (let i = 0; i < data.length; i++) {
            const url_cloudinary = "Books/" + data[i].url?.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(url_cloudinary)
        }
        await tx.books.delete({
            where: { id }
        })
        return book;
    });
    return deletedBook

};
export const getProductById = async (id: number) => {
    return await prisma.books.findUnique({
        where: { id },
        include: {
            BookImages: true,
            Categories: true,
        }
    })
}

export const getProductBySlug = async (slug: string) => {
    const product = await prisma.books.findFirst({
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

    if (!product) return null;

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
    if (files && files.length > 0) {

        for (let i = 0; i < files.length; i++) {
            const b64 = Buffer.from(files[i].buffer).toString("base64");
            const dataURI = `data:${files[i].mimetype};base64,${b64}`;
            const uploaded = await cloudinary.uploader.upload(dataURI, { folder: "Books" });
            uploadedAssets.push({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });

        }
    }
    try {
        const books = await prisma.$transaction(async (tx: any) => {
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
            },
            );

            if (data.attri?.length) {
                await tx.bookAttributes.createMany({
                    data: data.attri.map((e: any) => ({
                        book_id: id,
                        attr_key: e.key,
                        attr_value: e.value,
                    })),
                });
            }



            await tx.bookImages.createMany({
                data: uploadedAssets.map((url: any) => (
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


export const updateProductQuickActions = async (id: number, data: ProductQuickActionsInput) => {
    const updatedData: any = {};
    if (data.is_featured !== undefined) {
        updatedData.isFeatured = data.is_featured;
    }
    if (data.status !== undefined) {
        updatedData.status = data.status;
    }
    return await prisma.books.update({
        where: { id },
        data: updatedData,
    })

}


export const getCategoryBySlug = async (slug: string) => {
    return await prisma.categories.findFirst({
        where: { slug },
        select: {
            id: true,
        }
    })
}