import authController from '../../../controllers/users/authController';

const router = require('express').Router();
router.post('/register', authController.register);
export default router;
