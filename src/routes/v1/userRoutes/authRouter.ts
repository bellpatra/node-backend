import express from 'express';
import { loginUserHandler } from '../../../controllers/users/authController';

const router = express.Router();

/**
 * @swagger
 * /v1/auth/login:
 *   get:
 *     summary: Login endpoint
 *     description: Returns a login message.
 *     responses:
 *       200:
 *         description: Successful response with a login message.
 */
// Login user
router.post('/login', loginUserHandler);

// You can add more routes here, for example:
// router.post("/login", (req: Request, res: Response) => {
//   // Handle user login
// });

// router.post("/logout", (req: Request, res: Response) => {
//   // Handle user logout
// });

export default router;
