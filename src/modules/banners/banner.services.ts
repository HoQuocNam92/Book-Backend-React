
import * as bannersRepo from './banner.repositories.js';
import { BannerInput } from './banner.schema.js';
export const getAllBanners = async (pageNumber: number, type: string) => {
    const { banners, totalPages } = await bannersRepo.getBanners(pageNumber, type)
    return { banners, totalPages }
}

export const getBannersTypes = async (type: string) => {
    const types = await bannersRepo.getBannersTypes(type)
    return types
}
export const createNewBanner = async (data: BannerInput, file: Express.Multer.File) => {
    const banner = await bannersRepo.createBanner(data, file,)
    return banner
}
export const updateBanner = async (id: number, data: BannerInput, file?: Express.Multer.File) => {
    const existingBanner = await bannersRepo.getBannerById(id)
    if (!existingBanner) {
        throw new Error("BANNER_NOT_FOUND")
    }
    const banner = await bannersRepo.updateBannerById(id, data, file);
    return banner
}
export const deleteBanner = async (id: number) => {
    const existingBanner = await bannersRepo.getBannerById(id)
    if (!existingBanner) {
        throw new Error("BANNER_NOT_FOUND")
    }
    await bannersRepo.deleteBannerById(id)
}

