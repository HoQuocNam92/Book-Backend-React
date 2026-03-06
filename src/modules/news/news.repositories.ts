import prisma from "../../utils/prisma.js";
import { NewsInput } from "./news.schema.js";
import cloudinary from "../../utils/cloudinary.js";
export const getAllNews = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    const [news, total] = await Promise.all([
        prisma.news.findMany({
            orderBy: { created_at: 'desc' },
            skip,
            take: limit,
        }),
        prisma.news.count(),
    ]);
    return { news, totalPages: Math.ceil(total / limit) };
};

export const getPublishedNews = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    const [news, total] = await Promise.all([
        prisma.news.findMany({
            where: { is_published: true },
            orderBy: { created_at: 'desc' },
            skip,
            take: limit,
        }),
        prisma.news.count({ where: { is_published: true } }),
    ]);
    return { news, totalPages: Math.ceil(total / limit) };
};

export const getNewsBySlug = async (slug: string) => {
    return prisma.news.findUnique({ where: { slug } });
};

export const createNews = async (data: NewsInput, file: Express.Multer.File) => {
    return await prisma.$transaction(async (prisma) => {
        let uploadResult;

        try {
            const base64 = Buffer.from(file.buffer).toString('base64');
            const uri = `data:${file.mimetype};base64,${base64}`;
            uploadResult = await cloudinary.uploader.upload(uri, {
                folder: 'alphaBooks/news',
                public_id: `${Date.now()}-${file.originalname}`,
            });
            const news = await prisma.news.create({
                data: {
                    ...data, thumbnail: uploadResult?.secure_url
                }
            });
            return news;
        } catch (error) {
            if (uploadResult && uploadResult.public_id) {
                await cloudinary.uploader.destroy(uploadResult.public_id);
            }
            throw error;
        }
    });
};

export const updateNews = async (id: number, data: NewsInput, file: Express.Multer.File) => {
    return await prisma.$transaction(async (prisma) => {
        let uploadResult;
        try {
            if (file) {
                const base64 = Buffer.from(file.buffer).toString('base64');
                const uri = `data:${file.mimetype};base64,${base64}`;
                uploadResult = await cloudinary.uploader.upload(uri, {
                    folder: 'alphaBooks/news',
                    public_id: `${Date.now()}-${file.originalname}`,
                });
                ;
            }
            return prisma.news.update({
                where: { id }, data: {
                    ...data, thumbnail: file ? uploadResult?.secure_url : undefined
                }
            });
        } catch (error) {
            if (uploadResult && uploadResult.public_id) {
                await cloudinary.uploader.destroy(uploadResult.public_id);
            }
            throw error;
        }
    });
};



export const deleteNews = async (id: number) => {
    return prisma.news.delete({ where: { id } });
};



export const getNewsById = async (id: number) => {
    return prisma.news.findUnique({ where: { id } });
}