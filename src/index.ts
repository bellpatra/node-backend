import type { Server } from 'node:http';
import app from './app';
import prisma from './client';
import config from './config/config';
import logger from './config/logger';

let server: Server;

// Connect to the database and start the server
prisma
  ?.$connect()
  .then(() => {
    logger.info('Connected to SQL Database');
    server = app.listen(config.port, () => {
      logger.info(`Listening on port ${config.port}`);
    });
  })
  .catch((error) => {
    logger.error('Database connection failed:', error);
    process.exit(1); // Exit if the database connection fails
  });

// Graceful shutdown logic
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(0); // Use exit code 0 for a successful shutdown
    });
  } else {
    process.exit(0);
  }
};

// Handle unexpected errors
const unexpectedErrorHandler = (error: unknown) => {
  logger.error('Unexpected error:', error);
  exitHandler();
};

// Process-level error handlers
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Handle termination signals
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  exitHandler();
});

// Optionally, handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  logger.info('SIGINT received');
  exitHandler();
});
