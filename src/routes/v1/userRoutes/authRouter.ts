import authController from '../../../controllers/users/authController';
import auth from '../../../middleware/auth';

const router = require('express').Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-tokens', authController.refreshTokens);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);

export default router;
