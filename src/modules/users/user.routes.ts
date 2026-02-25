import express from 'express';
import authentication from '../../middlewares/auth/authentication';
import * as userControllers from './user.controllers';
import { upload } from '../../utils/upload';

const router = express.Router();

// Protected profile routes
router.get('/profile', authentication, userControllers.getProfile);
router.put('/profile', authentication, upload.single('avatar'), userControllers.updateProfile);

// Admin routes
router.get('/', userControllers.getAllUsers);
router.get('/:id', userControllers.getUserById);
router.delete('/:id', userControllers.deleteUser);

export default router;
