import { z } from 'zod';

export const password = z.string().refine(
  (value) => {
    if (value.length < 8) {
      return false;
    }
    if (!(value.match(/\d/) && value.match(/[a-zA-Z]/))) {
      return false;
    }
    return true;
  },
  {
    message: 'Password must be at least 8 characters long and contain at least 1 letter and 1 number',
  },
);
