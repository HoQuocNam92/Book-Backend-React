import prisma from "../../utils/prisma.js"
import { categoryInput } from "./category.schema.js";

export const getAllCategories = async () => {
    return await prisma.categories.findMany();
}


export const createCategory = async (data: categoryInput & { slug: string }) => {
    return await prisma.categories.create({
        data: {
            name: data.name,
            slug: data.slug,
            parent_id: data?.parent_id,
        }
    })
}


export const updateCategory = async (id: number, data: categoryInput & { slug: string }) => {
    return await prisma.categories.update({
        where: {
            id: id,
        },
        data: {
            name: data.name,
            slug: data.slug,
            parent_id: data?.parent_id,
        }
    })
}


export const deleteCategory = async (id: number) => {
    return await prisma.categories.delete({
        where: {
            id: id,
        }
    })
}


export const getCategoryById = async (id: number) => {
    return await prisma.categories.findUnique({
        where: {
            id: id,
        }
    })
}