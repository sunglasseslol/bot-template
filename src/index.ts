/**
 * Main Entry Point
 *
 * This is the entry point of the application. It creates a Bot instance
 * and starts it. It also handles graceful shutdown on process termination.
 */

import { Bot } from './Bot';
import { logger } from './utils/logger';

/**
 * Main function that starts the bot
 */
async function main(): Promise<void> {
  // Create bot instance
  const bot = new Bot();

  // Handle graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    await bot.stop();
    process.exit(0);
  };

  // Listen for termination signals
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Handle uncaught errors
  process.on('unhandledRejection', (error) => {
    logger.error('Unhandled promise rejection:', error);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    shutdown('uncaughtException');
  });

  // Start the bot
  try {
    await bot.start();
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

// Start the application
main().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});
