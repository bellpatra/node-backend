import { TokenType, type User } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import type { AuthTokensResponse } from '../types/response';
import ApiError from '../utils/ApiError';
import { encryptPassword, isPasswordMatch } from '../utils/encryption';
import exclude from '../utils/exclude';
import tokenService from './token.service';
import userService from './user.service';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<User, 'password'>>}
 */
const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<Omit<User, 'password'>> => {
  const user = await userService.getUserByEmail(email, [
    'id',
    'email',
    'name',
    'password',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt',
  ]);

  // biome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
  if (!user || !(await isPasswordMatch(password, user.password as string))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return exclude(user, ['password']);
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = async (refreshToken: string): Promise<void> => {
  if (!prisma) {
    throw new Error('Prisma client is not initialized');
  }

  const refreshTokenData = await prisma.token.findFirst({
    where: {
      token: refreshToken,
      type: TokenType.REFRESH,
      blacklisted: false,
    },
  });

  if (!refreshTokenData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Refresh token not found');
  }

  await prisma.token.delete({
    where: { id: refreshTokenData.id },
  });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<AuthTokensResponse>}
 */
const refreshAuth = async (refreshToken: string): Promise<AuthTokensResponse> => {
  // Check if prisma is defined
  if (!prisma) {
    throw new Error('Prisma client is not initialized');
  }

  try {
    // Verify the refresh token
    const refreshTokenData = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);
    const { userId } = refreshTokenData;

    // Delete the refresh token from the database
    await prisma.token.delete({ where: { id: refreshTokenData.id } });

    // Generate new authentication tokens
    return await tokenService.generateAuthTokens({ id: userId });
  } catch (error) {
    // Handle specific error cases if needed
    if (error instanceof ApiError) {
      throw error; // Re-throw if it's already an ApiError
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  // Check if prisma is defined
  if (!prisma) {
    throw new Error('Prisma client is not initialized');
  }

  try {
    // Verify the reset password token
    const resetPasswordTokenData = await tokenService.verifyToken(resetPasswordToken, TokenType.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenData.userId);

    // Ensure the user exists
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Encrypt the new password
    const encryptedPassword = await encryptPassword(newPassword);

    // Update the user's password
    await userService.updateUserById(user.id, { password: encryptedPassword });

    // Delete any existing reset password tokens for the user
    await prisma.token.deleteMany({ where: { userId: user.id, type: TokenType.RESET_PASSWORD } });
  } catch (error) {
    // Handle specific error cases
    if (error instanceof ApiError) {
      throw error; // Re-throw if it's already an ApiError
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<void>}
 */
const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  // Check if prisma is defined
  if (!prisma) {
    throw new Error('Prisma client is not initialized');
  }

  try {
    // Verify the email verification token
    const verifyEmailTokenData = await tokenService.verifyToken(verifyEmailToken, TokenType.VERIFY_EMAIL);

    // Delete the verification token from the database
    await prisma.token.deleteMany({
      where: { userId: verifyEmailTokenData.userId, type: TokenType.VERIFY_EMAIL },
    });

    // Update the user's email verification status
    await userService.updateUserById(verifyEmailTokenData.userId, { isEmailVerified: true });
  } catch (error) {
    // Handle specific error cases
    if (error instanceof ApiError) {
      throw error; // Re-throw if it's already an ApiError
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

export default {
  loginUserWithEmailAndPassword,
  isPasswordMatch,
  encryptPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
