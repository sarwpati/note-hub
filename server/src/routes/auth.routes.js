import express from 'express';
import { registerUser, loginUser, getCurrentUser, logoutUser, updateProfile } from '../controllers/auth.controller.js';
import protect from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema, updateProfileSchema } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logoutUser);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);

export default router;
