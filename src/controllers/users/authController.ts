import type { User } from '@prisma/client';
import httpStatus from 'http-status';
import { authService, emailService, tokenService, userService } from '../../services';
import catchAsync from '../../utils/catchAsync';
import exclude from '../../utils/exclude';
import responseHandler from '../../utils/responseHandler'; // Import the response handler

const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.createUser(email, password);
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt']);
  const tokens = await tokenService.generateAuthTokens(user);
  responseHandler(res, httpStatus.CREATED, { user: userWithoutPassword, tokens }, 'User registered successfully');
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  responseHandler(res, httpStatus.OK, { user, tokens }, 'Login successful');
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  responseHandler(res, httpStatus.NO_CONTENT);
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  responseHandler(res, httpStatus.OK, tokens, 'Tokens refreshed successfully');
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  responseHandler(res, httpStatus.NO_CONTENT);
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token as string, req.body.password);
  responseHandler(res, httpStatus.NO_CONTENT);
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const user = req.user as User;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  responseHandler(res, httpStatus.NO_CONTENT);
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token as string);
  responseHandler(res, httpStatus.NO_CONTENT);
});

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
