import compression from 'compression';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import config from './config/config';
import morgan from './config/morgan';
import { errorConverter, errorHandler } from './middleware/error';
import xss from './middleware/xss';
import ApiError from './utils/ApiError';

const app = express();

// Logging middleware for non-test environments
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Security middleware
app.use(helmet());

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Sanitize request data to prevent XSS attacks
app.use(xss());

// Gzip compression for responses
app.use(compression());

// Enable CORS
app.use(cors());
app.options('*', cors()); // Pre-flight request handling

// Default route for the homepage
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <html>
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
    </html>
  `);
});

// 404 Not Found handler
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

export default app;
