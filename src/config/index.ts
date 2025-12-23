/**
 * Configuration Management
 *
 * This module handles all configuration loading and validation.
 * It uses dotenv to load environment variables and provides
 * a typed configuration object for use throughout the application.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

/**
 * Configuration schema using Zod for runtime validation
 * This ensures all required environment variables are present
 */
const configSchema = z.object({
  // Discord Bot Configuration
  DISCORD_TOKEN: z.string().min(1, 'Discord token is required'),
  DISCORD_CLIENT_ID: z.string().min(1, 'Discord client ID is required'),

  // Database Configuration
  DATABASE_URL: z.string().url('Valid database URL is required'),

  // Bot Configuration (optional with defaults)
  BOT_PREFIX: z.string().optional().default('!'),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

/**
 * Type-safe configuration object
 * This is exported for use throughout the application
 */
export type Config = z.infer<typeof configSchema>;

/**
 * Validates and returns the configuration object
 * Throws an error if any required environment variables are missing
 */
function loadConfig(): Config {
  try {
    // Parse with defaults applied
    return configSchema.parse({
      DISCORD_TOKEN: process.env.DISCORD_TOKEN,
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
      DATABASE_URL: process.env.DATABASE_URL,
      BOT_PREFIX: process.env.BOT_PREFIX,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}

// Export the validated configuration
export const config = loadConfig();

// Export individual config values for convenience
export const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DATABASE_URL, BOT_PREFIX, NODE_ENV } = config;

// Re-export bot configuration
export { botConfig, getEmbedColor, isFeatureEnabled } from './botConfig';
export type { BotConfig } from './botConfig';
