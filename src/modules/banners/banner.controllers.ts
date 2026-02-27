import { NextFunction, Request, Response } from "express";
import { BannerSchema } from "./banner.schema";
import * as bannerServices from './banner.services.js'
export const getBannerAllOrByType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pageNumber = parseInt(req.query.page as string) || 1
        const type = (req.query.type as string) || 'all';
        const { banners, totalPages } = await bannerServices.getAllBanners(pageNumber, type)
        res.json({ banners, totalPages })
    } catch (error) {
        next(error)
    }
}

export const createBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { link_url, image_url, type } = req.body
        const validateInput = BannerSchema.parse({ link_url, image_url, type })
        const banner = await bannerServices.createNewBanner(validateInput)
        res.json(banner)
    }
    catch (error) {
        next(error)
    }
}


export const deleteBannerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string)
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid banner ID' })
        }
        const bannerId = await bannerServices.deleteBanner(id)
        res.json({ message: 'Banner xóa thành công ', bannerId })
    }
    catch (error) {
        next(error)
    }
}


export const updateBannerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string)
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid banner ID' })
        }
        const { link_url, image_url, type } = req.body
        const validateInput = BannerSchema.parse({ link_url, image_url, type })
        const banner = await bannerServices.updateBanner(id, validateInput)
        res.json(banner)
    }
    catch (error) {
        next(error)
    }
}