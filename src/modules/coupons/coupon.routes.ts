import express from 'express';
import * as couponController from './coupon.controllers';
import authorization from '../../middlewares/auth/authorization';
import authentication from '../../middlewares/auth/authentication';

const router = express.Router();

router.get('/', authorization, couponController.getAllCoupons);
router.post('/validate/:code', authentication, couponController.validateCoupon);
router.get('/:id', authentication, couponController.getCouponById);
router.post('/', authorization, couponController.createCoupon);
router.put('/:id', authorization, couponController.updateCoupon);
router.delete('/:id', authorization, couponController.deleteCoupon);

export default router;
