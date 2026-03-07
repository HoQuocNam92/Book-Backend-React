import express from 'express';
const router = express.Router();
import * as brandControllers from './brand.controllers.js';
import { upload } from '../../utils/upload.js';
import authorization from '../../middlewares/auth/authorization.js';


router.get('/', brandControllers.getAllBrands);
router.post('/', authorization, upload.single('logo_url'), brandControllers.createBrand);
router.put('/:id', authorization, upload.single('logo_url'), brandControllers.updateBrand);
router.delete('/:id', authorization, brandControllers.deleteBrand);
export default router;