import slugify from 'slugify';
import * as categoryRepository from './category.repositories.js';
import { categoryInput } from './category.schema.js';



export const getAllCategories = async (page: number) => {
    return await categoryRepository.getAllCategories(page);
}

export const createCategory = async (data: categoryInput) => {

    const slug = slugify(data.name.trim(), { lower: true });
    const category = await categoryRepository.createCategory({ ...data, slug });
    return category;
}

export const updateCategory = async (id: number, data: categoryInput) => {
    const category = await categoryRepository.getCategoryById(id);
    if (!category) {
        throw new Error("NOT_FOUND_CATEGORY");
    }
    const slug = slugify(data.name.trim(), { lower: true });
    return await categoryRepository.updateCategory(id, { ...data, slug });
}


export const deleteCategory = async (id: number) => {
    const category = await categoryRepository.getCategoryById(id);
    if (!category) {
        throw new Error("NOT_FOUND_CATEGORY");
    }
    return await categoryRepository.deleteCategory(id);
}

