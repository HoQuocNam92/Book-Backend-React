import prisma from '../../utils/prisma';

const PAGE_SIZE = 10
export const productRelated = async (id: number) => {
    const products = await prisma.books.findMany({
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
    })

    return {
        products: products.map((product) => ({
            ...product,
            BookImages: product.BookImages[0]?.url || null,
        })),
        total: products.length,
    }
}
