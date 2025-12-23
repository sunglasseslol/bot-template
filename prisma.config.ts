/**
 * Prisma Configuration
 *
 * In Prisma 7, connection URLs are moved from schema.prisma to this config file.
 * This allows for better separation of concerns and more flexible configuration.
 */

export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};

