import express from 'express';
const router = express.Router();
import * as brandControllers from './brand.controllers';
import { upload } from '../../utils/upload';


router.get('/', brandControllers.getAllBrands);
router.post('/', upload.single('logo_url'), brandControllers.createBrand);
router.put('/:id', upload.single('logo_url'), brandControllers.updateBrand);
router.delete('/:id', brandControllers.deleteBrand);
export default router;