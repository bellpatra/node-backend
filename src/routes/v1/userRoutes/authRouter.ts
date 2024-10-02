import express, { type Request, type Response } from 'express';

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

router.get('/login', (_req: Request, res: Response) => {
  res.send('login ');
});

// You can add more routes here, for example:
// router.post("/login", (req: Request, res: Response) => {
//   // Handle user login
// });

// router.post("/logout", (req: Request, res: Response) => {
//   // Handle user logout
// });

export default router;
