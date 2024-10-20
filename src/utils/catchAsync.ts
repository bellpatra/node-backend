import type { RequestHandler } from 'express';
import type { NextFunction, Request, Response } from 'express-serve-static-core';

export interface CustomParamsDictionary {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
}

const catchAsync =
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
    (fn: RequestHandler<CustomParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>) =>
    (
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      req: Request<CustomParamsDictionary, any, any, any, Record<string, any>>,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      res: Response<any, Record<string, any>, number>,
      next: NextFunction,
    ) => {
      Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };

export default catchAsync;
