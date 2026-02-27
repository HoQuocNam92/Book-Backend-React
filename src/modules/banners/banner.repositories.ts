import prisma from "../../utils/prisma"

const pageSize = 10
export const getBanners = async (pageNumber: number, type?: string) => {
    const skip = (pageNumber - 1) * pageSize
    const totalPages = Math.ceil(await prisma.banners.count() / pageSize)
    const whereCondition = type === "all" ? {} : { type }
    const banners = await prisma.banners.findMany({
        skip,
        take: pageSize,
        where: {
            type: whereCondition.type
        },
        orderBy: {
            created_at: 'desc'
        }
    })
    return { banners, totalPages }
}


export const createBanner = async (linkUrl: string, imageUrl: string, type: string) => {
    const banner = await prisma.banners.create({
        data: {
            image_url: imageUrl,
            link_url: linkUrl,
            type
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

export const updateBannerById = async (id: number, linkUrl: string, imageUrl: string, type: string) => {
    const banner = await prisma.banners.update({
        where: {
            id
        },
        data: {
            image_url: imageUrl,
            link_url: linkUrl,
            type
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