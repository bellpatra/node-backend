import { PrismaClient, type User } from '@prisma/client';
import config from 'config';
import redisClient from '../utils/connectRedis';
import { signJwt } from '../utils/jwt';

const prisma = new PrismaClient(); // Initialize Prisma Client

export const signTokens = async (user: User) => {
  // 1. Create Session
  await redisClient.set(user.id.toString(), JSON.stringify(user), {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    EX: config.get<number>('redisCacheExpiresIn') * 60,
  });

  // 2. Create Access and Refresh tokens
  const accessToken = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
    expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
  });

  const refreshToken = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
    expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
  });

  return { accessToken: accessToken, refreshToken: refreshToken };
};

// Find user by ID using Prisma Client
export const findUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};
