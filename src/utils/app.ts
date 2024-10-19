import express from 'express';

import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import httpStatus from 'http-status';
import config from './config/config';
import morgan from './config/morgan';
import { errorConverter, errorHandler } from './middleware/error';
import xss from './middleware/xss';
import ApiError from './utils/ApiError';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());
// enable cors
app.use(cors());
app.options('*', cors());
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
export default app;
