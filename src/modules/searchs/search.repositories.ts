import prisma from "../../utils/prisma";


export const searchBooks = async (query: string) => {
    const books = await prisma.$queryRaw`
        SELECT b.id, b.title, b.slug, b.price, b.discount_percent
        FROM books b
        JOIN BookImages bimg ON b.id = bimg.book_id
        WHERE FREETEXT(b.title , ${query}) and status ='active'
        ORDER BY b.updated_at DESC
        OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY
         
    `;
    return books;
}

export const searchBookByCategory = async (query: string) => {
    const books = await prisma.$queryRaw`
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
}

export const searchCategories = async (query: string) => {
    const categories = await prisma.$queryRaw`
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
}

export const searchAuthors = async (query: string) => {
    const authors = await prisma.$queryRaw`
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
}