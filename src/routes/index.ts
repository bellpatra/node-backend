import express, { type Request, type Response } from 'express';
import redisClient from '../utils/connectRedis';
import v1 from './v1';

import swaggerDocs from '../utils/swagger';

const router = express.Router();

router.use('/v1', v1); // Mount versioned routes

router.get('/', (_req: Request, res: Response) => {
  res.send('API : HOME');
});
//call swagger docs
swaggerDocs(router);

router.get('/checkme', async (_req: Request, res: Response) => {
  try {
    const message = await redisClient.get('try');

    if (message) {
      res.status(200).json({ status: 'success', message });
    } else {
      res.status(404).json({ status: 'error', message: 'Key not found in Redis' });
    }
  } catch (error) {
    console.error('Error fetching from Redis:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Middleware for the root page

// Middleware for 404 page

export default router;
