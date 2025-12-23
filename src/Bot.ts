/**
 * Bot Class
 *
 * This is the main bot class that initializes and manages the Discord bot.
 * It handles client creation, command registration, event registration,
 * and provides a clean interface for starting and stopping the bot.
 */

import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { config } from './config';
import { logger } from './utils/logger';
import { CommandManager } from './managers/CommandManager';
import { commands } from './commands';
import { registerAllEvents } from './events';
import { prisma } from './utils/database';

/**
 * Main Bot class
 * Handles bot initialization and lifecycle management
 */
export class Bot {
  /**
   * The Discord.js client instance
   */
  public readonly client: Client;

  /**
   * The command manager instance
   */
  public readonly commandManager: CommandManager;

  /**
   * Creates a new Bot instance
   */
  constructor() {
    // Create Discord client with required intents
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });

    // Initialize command manager
    this.commandManager = new CommandManager();

    // Register all commands
    this.commandManager.registerCommands(commands);

    // Register all event handlers
    registerAllEvents(this.client, this.commandManager);

    // Handle client errors
    this.setupErrorHandlers();
  }

  /**
   * Sets up error handlers for the Discord client
   */
  private setupErrorHandlers(): void {
    // Handle client errors
    this.client.on('error', (error) => {
      logger.error('Discord client error:', error);
    });

    // Handle warnings
    this.client.on('warn', (warning) => {
      logger.warn('Discord client warning:', warning);
    });

    // Handle disconnects
    this.client.on('disconnect', () => {
      logger.warn('Bot disconnected from Discord');
    });

    // Handle reconnects
    this.client.on('reconnecting', () => {
      logger.info('Bot reconnecting to Discord...');
    });
  }

  /**
   * Starts the bot
   * Connects to Discord and initializes the bot
   */
  public async start(): Promise<void> {
    try {
      logger.info('Starting bot...');

      // Test database connection
      await prisma.$connect();
      logger.info('Database connection established');

      // Login to Discord
      await this.client.login(config.DISCORD_TOKEN);
    } catch (error) {
      logger.error('Failed to start bot:', error);
      throw error;
    }
  }

  /**
   * Stops the bot gracefully
   * Disconnects from Discord and closes database connections
   */
  public async stop(): Promise<void> {
    try {
      logger.info('Stopping bot...');

      // Destroy the Discord client
      this.client.destroy();

      // Disconnect from database
      await prisma.$disconnect();
      logger.info('Database connection closed');

      logger.info('Bot stopped successfully');
    } catch (error) {
      logger.error('Error stopping bot:', error);
      throw error;
    }
  }
}
