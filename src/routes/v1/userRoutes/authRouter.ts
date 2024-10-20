import validate from '../../../middleware/validate';
import authValidation from '../../../validations/auth.validation';

import authController from '../../../controllers/users/authController';
import auth from '../../../middleware/auth';

const router = require('express').Router();
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', authController.refreshTokens);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);

export default router;
