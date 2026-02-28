import express from 'express'
const router = express.Router()
import * as  bannerControllers from './banner.controllers'
import { upload } from '../../utils/upload'

router.get('/', bannerControllers.getAllBanners)
router.get('/type', bannerControllers.getBannersTypes)
router.post('/', upload.single('image'), bannerControllers.createBanner)
router.put('/:id', upload.single('image'), bannerControllers.updateBannerById)
router.delete('/:id', bannerControllers.deleteBannerById)
export default router