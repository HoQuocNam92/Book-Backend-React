import authentication from '../../middlewares/auth/authentication';
import refreshTokenMiddleware from '../../middlewares/auth/refreshTokenMiddleware';
import * as authController from './auth.controllers';
import express from 'express';

const router = express.Router();

router.get('/google', authController.googleCallback)
router.get('/google/callback', authController.signInWithGoogle)

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-passwowrd', authentication, authController.verifyPassword);
router.post('/reset-password', authController.resetPassord);
router.post(
  '/refresh-token',
  refreshTokenMiddleware,
  authController.refreshToken,
);

router.post('/sign-out', authentication, authController.signOut);
export default router;
