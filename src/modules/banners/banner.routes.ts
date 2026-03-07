import express from 'express'
const router = express.Router()
import * as  bannerControllers from './banner.controllers'
import { upload } from '../../utils/upload'
import authorization from '../../middlewares/auth/authorization'
import authentication from '../../middlewares/auth/authentication'
router.get('/', bannerControllers.getAllBanners)
router.get('/type', bannerControllers.getBannersTypes)
router.post('/', authorization, upload.single('image'), bannerControllers.createBanner)
router.put('/:id', authorization, upload.single('image'), bannerControllers.updateBannerById)
router.delete('/:id', authorization, bannerControllers.deleteBannerById)
export default router