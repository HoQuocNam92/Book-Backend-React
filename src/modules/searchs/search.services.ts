import * as searchRepository from './search.repositories.js';

export const searchBooks = async (query: string) => {
    return await searchRepository.searchBooks(query);
};

export const searchBookByCategory = async (query: string) => {
    return await searchRepository.searchBookByCategory(query);
}

export const searchCategories = async (query: string) => {
    return await searchRepository.searchCategories(query);
}

export const searchAuthors = async (query: string) => {
    return await searchRepository.searchAuthors(query);
}