import { z } from 'zod';
import { password } from './custom.validation';

const register = {
  body: z.object({
    email: z.string().email(),
    password: password,
  }),
};

const login = {
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
};

const logout = {
  body: z.object({
    refreshToken: z.string(),
  }),
};

const refreshTokens = {
  body: z.object({
    refreshToken: z.string(),
  }),
};

const forgotPassword = {
  body: z.object({
    email: z.string().email(),
  }),
};

const resetPassword = {
  query: z.object({
    token: z.string(),
  }),
  body: z.object({
    password: password,
  }),
};

const verifyEmail = {
  query: z.object({
    token: z.string(),
  }),
};

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
