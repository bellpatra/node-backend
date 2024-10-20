import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import config from './config/config';
import morgan from './config/morgan';
import { errorConverter, errorHandler } from './middleware/error';
import xss from './middleware/xss';
import indexRouter from './routes/index';
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
app.use('/', indexRouter);

// Sanitize request data to prevent XSS attacks
app.use(xss());

// Gzip compression for responses
app.use(compression());

// Enable CORS
app.use(cors());
app.options('*', cors()); // Pre-flight request handling

// Default route for the homepage

app.use((_req, _res, next) => {
  next(
    new ApiError(
      httpStatus.NOT_FOUND,
      '🚫 Oops! The page you’re looking for doesn’t exist. Please check the URL or return to the homepage. 😊',
    ),
  );
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

export default app;
