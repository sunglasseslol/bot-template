/**
 * Database Utility Module
 *
 * This module provides a singleton Prisma client instance
 * for use throughout the application. It ensures only one
 * database connection is created and reused.
 */

import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma client instance
 * In development, this prevents multiple instances from being created
 * during hot-reloading
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Prisma client instance
 * Uses the global instance in development to prevent connection issues
 * Creates a new instance in production
 */
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// In development, store the client globally to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Disconnects the Prisma client from the database
 * Useful for graceful shutdowns
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
