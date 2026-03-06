import { NextFunction, Request, Response } from 'express';
import * as searchServices from './search.services.js';

export const getSearchBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.query as { key: string };
        const books = await searchServices.searchBooks(key);
        return res.json({ message: 'Tìm kiếm thành công', data: books });
    } catch (error) {
        next(error);
    }
}

export const getSearchBookByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.query as { key: string };
        const books = await searchServices.searchBookByCategory(key);
        return res.json({ message: 'Tìm kiếm thành công', data: books });
    }
    catch (error) {
        next(error);
    }
}

export const getSearchCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.query as { key: string };
        const categories = await searchServices.searchCategories(key);
        return res.json({ message: 'Tìm kiếm thành công', data: categories });
    }
    catch (error) {
        next(error);
    }

}

export const getSearchAuthors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.query as { key: string };
        const authors = await searchServices.searchAuthors(key);
        return res.json({ message: 'Tìm kiếm thành công', data: authors });
    }
    catch (error) {
        next(error);
    }
}