import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient();
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    return global.prisma;
  }
}

export const prismaConnection = createPrismaClient();

async function connectPrisma() {
  try {
    await prismaConnection.$connect();
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

connectPrisma();

async function disconnectPrisma() {
  await prismaConnection.$disconnect();
  console.log('Disconnected from the database');
}

process.on('beforeExit', disconnectPrisma);
process.on('SIGINT', async () => {
  await disconnectPrisma();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await disconnectPrisma();
  process.exit(0);
});

export default prisma;
