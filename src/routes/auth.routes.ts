import express from 'express';
import { authController } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', protect, authController.getProfile);

export default router;