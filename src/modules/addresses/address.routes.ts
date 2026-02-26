import express from 'express';
import authentication from '../../middlewares/auth/authentication.js';
import * as addressControllers from './address.controllers.js';

const router = express.Router();

router.use(authentication);

router.get('/', addressControllers.getMyAddresses);
router.post('/', addressControllers.createAddress);
router.put('/:id', addressControllers.updateAddress);
router.delete('/:id', addressControllers.deleteAddress);

router.get('/provinces', addressControllers.getProvinces);
router.get('/districts/:provinceId', addressControllers.getDistricts);
router.get('/wards/:districtId', addressControllers.getWards);

export default router;
