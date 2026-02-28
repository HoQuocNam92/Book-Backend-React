import prisma from "../../utils/prisma"
import cloudinary from '../../utils/cloudinary.js'
import { BannerInput } from "./banner.schema"
const pageSize = 10
export const getBanners = async (pageNumber: number, type?: string) => {
    const skip = (pageNumber - 1) * pageSize
    const totalPages = Math.ceil(await prisma.banners.count() / pageSize)
    const banners = await prisma.banners.findMany({
        skip,
        take: pageSize,
        orderBy: {
            created_at: 'desc'
        }
    })
    return { banners, totalPages }
}
export const getBannersTypes = async (type: string) => {
    const banners = await prisma.banners.findMany({
        where: {
            type: type
        }
    })
    return banners
}


export const createBanner = async (data: BannerInput, file: Express.Multer.File) => {


    const banner = await prisma.$transaction(async (tx) => {
        let image = null
        try {
            const base64 = Buffer.from(file.buffer).toString('base64')
            const filePath = `data:${file.mimetype};base64,${base64}`
            image = await cloudinary.uploader.upload(filePath)
            const newBanner = await tx.banners.create({
                data: {
                    link_url: data.link_url,
                    image_url: image.secure_url,
                    type: data.type
                }

            })
            return newBanner
        } catch (error) {
            if (image) {
                await cloudinary.uploader.destroy(image.public_id)
            }
            throw error
        }

    })
    return banner
}

export const deleteBannerById = async (id: number) => {
    await prisma.banners.delete({
        where: {
            id
        }
    })
}

export const updateBannerById = async (id: number, data: BannerInput, file?: Express.Multer.File, type?: string) => {
    const banner = await prisma.$transaction(async (tx) => {
        let image = null
        try {
            if (file) {
                const base64 = Buffer.from(file.buffer).toString('base64')
                const filePath = `data:${file.mimetype};base64,${base64}`
                image = await cloudinary.uploader.upload(filePath)
            }
            const whereCondition = image ? image.secure_url : undefined
            const updatedBanner = await tx.banners.update({
                where: {
                    id
                },
                data: {
                    link_url: data.link_url,
                    image_url: whereCondition,
                    type: data.type
                }
            })
            return updatedBanner
        } catch (error) {
            if (image) {
                await cloudinary.uploader.destroy(image.public_id)
            }
            throw error
        }
    })
    return banner
}

export const getBannerById = async (id: number) => {
    const banner = await prisma.banners.findUnique({
        where: { id }
    })
    return banner
}