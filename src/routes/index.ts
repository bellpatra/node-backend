import express, { type Request, type Response } from 'express';
import redisClient from '../utils/connectRedis';
import v1 from './v1';

import swaggerDocs from '../utils/swagger';

const router = express.Router();

router.use('/v1', v1); // Mount versioned routes

router.get('/', (_req: Request, res: Response) => {
  res.send(` <html>
      <head>
        <style>
          body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            color: #333;
            text-align: center;
          }
          h1 {
            font-size: 2.5rem;
          }
          p {
            font-size: 1.2rem;
          }
          img {
            width: 200px; /* Adjust the width as needed */
            margin-bottom: 20px; /* Space between logo and text */
          }
        </style>
      </head>
      <body>
        <div>
          <h1>👋 Welcome to the homepage!</h1>
          <p>✨ We're glad to have you here! ✨</p>
        </div>
      </body>
    </html>`);
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
