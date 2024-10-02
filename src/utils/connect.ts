import { PrismaClient } from '@prisma/client';
import logger from './logger'; // Adjust the path as necessary

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query', // Log all queries
    },
    {
      emit: 'event',
      level: 'info', // Log informational messages
    },
    {
      emit: 'event',
      level: 'warn', // Log warnings
    },
    {
      emit: 'event',
      level: 'error', // Log errors
    },
  ],
});

// Event listeners for logging
prisma.$on('query', (e) => {
  logger.info(`Query: ${e.query} ${e.params}`);
});

prisma.$on('info', (e) => {
  logger.info(`Info: ${e.message}`);
});

prisma.$on('warn', (e) => {
  logger.warn(`Warning: ${e.message}`);
});

prisma.$on('error', (e) => {
  logger.error(`Error: ${e.message}`);
});

// Function to connect to the database
async function connect() {
  try {
    await prisma.$connect();
    logger.info('DB connected successfully');
  } catch (error) {
    logger.error('Could not connect to DB: ', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  logger.info('DB disconnected due to application termination');
  process.exit(0);
});

export { connect, prisma };
