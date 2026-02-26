import slugify from 'slugify';
import * as categoryRepository from './category.repositories.js';
export const getAllCategories = async () => {
    return await categoryRepository.getAllCategories();
};
export const createCategory = async (data) => {
    const slug = slugify(data.name.trim(), { lower: true });
    const category = await categoryRepository.createCategory({ ...data, slug });
    return category;
};
export const updateCategory = async (id, data) => {
    const category = await categoryRepository.getCategoryById(id);
    if (!category) {
        throw new Error("NOT_FOUND_CATEGORY");
    }
    const slug = slugify(data.name.trim(), { lower: true });
    return await categoryRepository.updateCategory(id, { ...data, slug });
};
export const deleteCategory = async (id) => {
    const category = await categoryRepository.getCategoryById(id);
    if (!category) {
        throw new Error("NOT_FOUND_CATEGORY");
    }
    return await categoryRepository.deleteCategory(id);
};
