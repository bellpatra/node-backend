import { Prisma } from '@prisma/client';
import type { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import config from '../config/config';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';

export const errorConverter: ErrorRequestHandler = (err, _req, _res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      (error instanceof Prisma.PrismaClientKnownRequestError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR);

    const message = error.message || httpStatus[statusCode as keyof typeof httpStatus];

    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const { statusCode = httpStatus.INTERNAL_SERVER_ERROR, message: initialMessage } = err as ApiError;

  const statusMessages: Record<number, string> = {
    [httpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    [httpStatus.BAD_REQUEST]: 'Bad Request',
    [httpStatus.UNAUTHORIZED]: 'Unauthorized',
    [httpStatus.FORBIDDEN]: 'Forbidden',
    [httpStatus.NOT_FOUND]: 'Not Found',
    // Add other status codes and messages as needed
  };

  let message = initialMessage;

  // Check for operational error in production
  if (config.env === 'production' && !err.isOperational) {
    message = statusMessages[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  // Log the error
  if (config.env === 'development') {
    logger.error(err);
  } else {
    // Log operational errors minimally or in a different way, if needed
    logger.warn(`Operational error: ${message}`);
  }

  res.status(statusCode).send(response);
};
