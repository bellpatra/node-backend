import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import passport from 'passport';
import config from './config/config';
import morgan from './config/morgan';

import { jwtStrategy } from './config/passport';
import { errorConverter, errorHandler } from './middleware/error';
import { authLimiter } from './middleware/rateLimiter';
import xss from './middleware/xss';
import indexRouter from './routes/index';
import ApiError from './utils/ApiError';
//import errorHandlerResponse from './utils/errorHandler'

const app = express();

// Security middleware
app.use(helmet());

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gzip compression for responses
app.use(compression());
//* ths is for testing

// Enable CORS
app.use(cors());
app.options('*', cors()); // Pre-flight request handling

// Logging middleware for non-test environments
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Limit repeated failed requests to auth endpoints in production
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// Sanitize request data to prevent XSS attacks
app.use(xss());

// Main application routes
app.use('/', indexRouter);

// Handle 404 Not Found
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
// app.use(errorHandlerResponse);

export default app;
