/**
 * Database Utility Module
 *
 * This module provides a singleton Prisma client instance
 * for use throughout the application. It ensures only one
 * database connection is created and reused.
 *
 * Updated for Prisma 7: Uses adapter pattern for PostgreSQL connection pooling.
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { logger } from './logger';

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
 * Creates a Prisma client instance with PostgreSQL adapter (Prisma 7)
 * Uses connection pooling for better performance
 */
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Create PostgreSQL connection pool
  const pool = new Pool({ connectionString });

  // Create Prisma adapter for PostgreSQL (required in Prisma 7)
  const adapter = new PrismaPg(pool);

  // Configure logging based on environment
  const logLevel = process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'];

  // Create Prisma client with adapter
  const client = new PrismaClient({
    adapter,
    log: logLevel.length > 0 ? logLevel : [{ emit: 'stdout', level: 'error' }],
  });

  // Log queries in development if enabled
  if (process.env.NODE_ENV === 'development' && logLevel.includes('query')) {
    client.$on('query' as never, (e: { query: string; params: string; duration: number }) => {
      logger.debug(`Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
    });
  }

  return client;
}

/**
 * Prisma client instance
 * Uses the global instance in development to prevent connection issues
 * Creates a new instance in production
 */
export const prisma = global.prisma ?? createPrismaClient();

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
