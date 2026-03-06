import slugify from 'slugify';
import * as newsRepository from './news.repositories.js';
import { NewsInput } from './news.schema.js';

export const getAllNews = async (page: number = 1) => {
    return newsRepository.getAllNews(page);
};

export const getPublishedNews = async (page: number = 1) => {
    return newsRepository.getPublishedNews(page);
};

export const getNewsBySlug = async (slug: string) => {
    return newsRepository.getNewsBySlug(slug);
};

export const createNews = async (data: NewsInput, file: Express.Multer.File) => {
    const slug = slugify(data.title, {
        lower: true,
    });
    return newsRepository.createNews({ ...data, slug }, file);
};

export const updateNews = async (id: number, data: NewsInput, file: Express.Multer.File) => {
    const news = await newsRepository.getNewsById(id);
    if (!news) {
        throw new Error('NOT_FOUND_NEWS');
    }
    const slug = slugify(data.title, {
        lower: true,
    });
    return newsRepository.updateNews(id, { ...data, slug }, file);
};

export const deleteNews = async (id: number) => {
    const news = await newsRepository.getNewsById(id);
    if (!news) {
        throw new Error('NOT_FOUND_NEWS');
    }
    return newsRepository.deleteNews(id);
};
