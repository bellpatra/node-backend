// app.ts

require('dotenv').config();
import config from 'config';
import express, { type Request, type Response } from 'express';

import { PrismaClient } from '@prisma/client';

import indexRouter from './routes/index';

// Validate environment variables

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();

// Logger

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10kb' }));

// Route Prefixes
app.use('/', indexRouter);

// Global error handler
app.use((error: Error, _req: Request, res: Response) => {
  res.status(500).json({ status: 'error', message: error.message });
});

// Start server and connect to database
const startServer = async () => {
  try {
    const port = config.get<number>('port');
    await prisma.$connect(); // Connect to the database
    console.log('Connected to the database');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

export { prisma }; // Export prisma client for use in other modules
