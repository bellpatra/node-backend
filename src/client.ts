import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined; // Declare a global Prisma client for development
}

function createPrismaClient() {
  if (process.env.NODE_ENV === 'production') {
    // Create a new PrismaClient instance for production
    return new PrismaClient();
  }
  // Use a singleton pattern for development to prevent multiple connections
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  return global.prisma;
}

// Create and export the Prisma client instance
export const prismaConnection = createPrismaClient();

async function connectPrisma() {
  try {
    await prismaConnection.$connect(); // Connect to the database
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit on connection failure
  }
}

// Connect to the database when the module is loaded
connectPrisma();

async function disconnectPrisma() {
  try {
    await prismaConnection.$disconnect(); // Disconnect from the database
    console.log('Disconnected from the database');
  } catch (error) {
    console.error('Error during disconnection:', error);
  }
}

// Handle application shutdown
process.on('beforeExit', disconnectPrisma);
process.on('SIGINT', async () => {
  await disconnectPrisma();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await disconnectPrisma();
  process.exit(0);
});

// Export the Prisma client for use in other modules
export default prismaConnection;
