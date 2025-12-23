/**
 * Ready Event Handler
 * 
 * This event is fired when the bot successfully connects to Discord
 * and is ready to start receiving events. This is where you should
 * perform initialization tasks like registering slash commands.
 */

import { Client, Events } from 'discord.js';
import { logger } from '../utils/logger';
import { CommandManager } from '../managers/CommandManager';
import { config } from '../config';

/**
 * Handles the ready event
 * @param client - The Discord client instance
 * @param commandManager - The command manager instance
 */
export async function handleReady(
  client: Client,
  commandManager: CommandManager
): Promise<void> {
  // Log that the bot is ready
  logger.info(`Bot logged in as ${client.user?.tag}`);

  // Set bot activity/status
  client.user?.setActivity('with TypeScript', { type: 1 }); // 1 = Playing

  // Register slash commands
  try {
    // Register commands globally (takes up to 1 hour to propagate)
    // For faster testing, you can register to a specific guild by passing guildId
    await commandManager.registerSlashCommands(
      config.DISCORD_CLIENT_ID,
      config.DISCORD_TOKEN
      // Uncomment the line below and add your guild ID for faster testing
      // 'your-guild-id-here'
    );
  } catch (error) {
    logger.error('Failed to register slash commands:', error);
  }

  logger.info('Bot is ready!');
}

/**
 * Registers the ready event listener
 * @param client - The Discord client instance
 * @param commandManager - The command manager instance
 */
export function registerReadyEvent(
  client: Client,
  commandManager: CommandManager
): void {
  client.once(Events.ClientReady, () => {
    handleReady(client, commandManager).catch((error) => {
      logger.error('Error in ready event handler:', error);
    });
  });
}

