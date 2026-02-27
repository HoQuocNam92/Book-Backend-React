import express from 'express'
const router = express.Router()
import * as  bannerControllers from './banner.controllers'

router.get('/', bannerControllers.getBannerAllOrByType)
router.post('/', bannerControllers.createBanner)
router.delete('/:id', bannerControllers.deleteBannerById)
router.put('/:id', bannerControllers.updateBannerById)
export default router