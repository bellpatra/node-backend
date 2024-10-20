import type { Response } from 'express';

const responseHandler = (res: Response, status: number, data = null, message = '') => {
  return res.status(status).json({
    status,
    data,
    message,
  });
};

export default responseHandler;
