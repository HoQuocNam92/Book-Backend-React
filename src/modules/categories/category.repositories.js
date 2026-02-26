import prisma from "../../utils/prisma.js";
export const getAllCategories = async () => {
    return await prisma.categories.findMany();
};
export const createCategory = async (data) => {
    return await prisma.categories.create({
        data: {
            name: data.name,
            slug: data.slug,
            parent_id: data?.parent_id,
        }
    });
};
export const updateCategory = async (id, data) => {
    return await prisma.categories.update({
        where: {
            id: id,
        },
        data: {
            name: data.name,
            slug: data.slug,
            parent_id: data?.parent_id,
        }
    });
};
export const deleteCategory = async (id) => {
    return await prisma.categories.delete({
        where: {
            id: id,
        }
    });
};
export const getCategoryById = async (id) => {
    return await prisma.categories.findUnique({
        where: {
            id: id,
        }
    });
};
