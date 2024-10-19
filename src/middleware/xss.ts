import type { NextFunction, Request, Response } from 'express';
import { inHTMLData } from 'xss-filters';

/**
 * Clean for XSS.
 * @param {string | object} data - The value to sanitize
 * @return {string | object} The sanitized value
 */
export const clean = <T>(data: T | string = ''): T => {
  let isObject = false;
  let sanitizedData = data;

  if (typeof sanitizedData === 'object' && sanitizedData !== null) {
    sanitizedData = JSON.stringify(sanitizedData);
    isObject = true;
  }

  sanitizedData = inHTMLData(sanitizedData as string).trim();

  if (isObject) {
    sanitizedData = JSON.parse(sanitizedData);
  }

  return sanitizedData as T;
};
const middleware = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.body) {
      req.body = clean(req.body);
    }
    if (req.query) {
      req.query = clean(req.query);
    }
    if (req.params) {
      req.params = clean(req.params);
    }
    next();
  };
};

export default middleware;
