import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const errorHandlerResponse = (
  err: { status: number; message: string },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Log the error for debugging (consider using a logging library)
  console.error(err);

  // Determine the status code to return
  const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;

  // Set a default message if none is provided
  const message = err.message || 'An unexpected error occurred';

  // Return the error response
  return res.status(status).json({
    status,
    data: null,
    message,
  });
};

export default errorHandlerResponse;
