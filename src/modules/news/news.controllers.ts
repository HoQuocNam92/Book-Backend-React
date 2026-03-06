import { NextFunction, Request, Response } from 'express';
import * as newsServices from './news.services.js';
import { newsSchema } from './news.schema.js';

export const getAllNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const { news, totalPages } = await newsServices.getAllNews(page);
        return res.json({ message: 'Lấy tin tức thành công', data: news, totalPages });
    } catch (error) {
        next(error);
    }
};

export const getPublishedNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const { news, totalPages } = await newsServices.getPublishedNews(page);
        return res.json({ message: 'Lấy tin tức thành công', data: news, totalPages });
    } catch (error) {
        next(error);
    }
};

export const getNewsBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slug = req.params.slug as string;
        const news = await newsServices.getNewsBySlug(slug);
        if (!news) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }
        return res.json({ message: 'Lấy tin tức thành công', data: news });
    } catch (error) {
        next(error);
    }
};

export const createNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file as Express.Multer.File;
        if (!file) {
            throw new Error('THUMBNAIL_REQUIRED');
        }
        const validateData = newsSchema.parse(req.body);
        const news = await newsServices.createNews(validateData, file);
        return res.status(201).json({ message: 'Tạo tin tức thành công', data: news });
    } catch (error) {
        next(error);
    }
};

export const updateNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file as Express.Multer.File;
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        if (!file) {
            throw new Error('THUMBNAIL_REQUIRED');
        }


        const validateData = newsSchema.parse(req.body);
        const news = await newsServices.updateNews(id, validateData, file);
        return res.json({ message: 'Cập nhật tin tức thành công', data: news });
    } catch (error) {
        next(error);
    }
};

export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        await newsServices.deleteNews(id);
        return res.json({ message: 'Xóa tin tức thành công' });
    } catch (error) {
        next(error);
    }
};
