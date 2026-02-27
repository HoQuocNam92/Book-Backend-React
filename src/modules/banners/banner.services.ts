
import * as bannersRepo from './banner.repositories.js';
import { BannerInput } from './banner.schema.js';
export const getAllBanners = async (pageNumber: number, type: string) => {
    const { banners, totalPages } = await bannersRepo.getBanners(pageNumber, type)
    return { banners, totalPages }
}


export const createNewBanner = async (data: BannerInput) => {
    const banner = await bannersRepo.createBanner(data.link_url, data.image_url, data.type)
    return banner
}

export const deleteBanner = async (id: number) => {
    const existingBanner = await bannersRepo.getBannerById(id)
    if (!existingBanner) {
        throw new Error("BANNER_NOT_FOUND")
    }
    await bannersRepo.deleteBannerById(id)
}

export const updateBanner = async (id: number, data: BannerInput) => {
    const existingBanner = await bannersRepo.getBannerById(id)
    if (!existingBanner) {
        throw new Error("BANNER_NOT_FOUND")
    }
    const banner = await bannersRepo.updateBannerById(id, data.link_url, data.image_url, data.type)
    return banner
}