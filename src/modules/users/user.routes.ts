import express from 'express';
import authentication from '../../middlewares/auth/authentication.js';
import * as userControllers from './user.controllers.js';
import { upload } from '../../utils/upload.js';
import authorization from '../../middlewares/auth/authorization.js';

const router = express.Router();

// Protected profile routes
router.get('/profile', authentication, userControllers.getProfile);
router.put('/profile', authentication, upload.single('avatar'), userControllers.updateProfile);

// Admin routes
router.get('/', authorization, userControllers.getAllUsers);
router.get('/:id', authorization, userControllers.getUserById);
router.delete('/:id', authorization, userControllers.deleteUser);

export default router;
