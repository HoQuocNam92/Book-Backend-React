import express from 'express';
import * as couponController from './coupon.controllers';
import authorization from '../../middlewares/auth/authorization';

const router = express.Router();

router.get('/', authorization, couponController.getAllCoupons);
router.get('/:id', couponController.getCouponById);
router.post('/', authorization, couponController.createCoupon);
router.put('/:id', authorization, couponController.updateCoupon);
router.delete('/:id', authorization, couponController.deleteCoupon);

export default router;
