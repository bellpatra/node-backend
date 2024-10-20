import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { type ZodSchema, z } from 'zod';
import ApiError from '../utils/ApiError';
import pick from '../utils/pick';

const validate = (schema: Record<string, ZodSchema>) => (req: Request, _res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']) as {
    [key: string]: ZodSchema;
  };
  const obj = pick(req, Object.keys(validSchema));

  // Validate using Zod
  try {
    const parsedData = z.object(validSchema).parse(obj);
    Object.assign(req, parsedData); // Assign parsed data to req
    next(); // Proceed to the next middleware
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Collect all error messages
      const errorMessage = error.errors.map((details) => details.message).join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    // Handle unexpected errors
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error'));
  }
};

export default validate;
