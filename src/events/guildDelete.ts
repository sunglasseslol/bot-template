/**
 * Guild Delete Event Handler
 *
 * This event is fired when the bot leaves a server (guild) or the server is deleted.
 * Useful for logging and cleanup.
 */

import { Events, Guild } from 'discord.js';
import { logger } from '../utils/logger';

/**
 * Handles the guild delete event
 * @param guild - The guild that was left
 */
export async function handleGuildDelete(guild: Guild): Promise<void> {
  try {
    logger.info(`Left guild: ${guild.name} (${guild.id})`);
  } catch (error) {
    logger.error('Error handling guild delete event:', error);
  }
}

/**
 * Registers the guild delete event listener
 * @param client - The Discord client instance
 */
export function registerGuildDeleteEvent(client: import('discord.js').Client): void {
  client.on(Events.GuildDelete, (guild: Guild) => {
    handleGuildDelete(guild).catch((error) => {
      logger.error('Error in guild delete event handler:', error);
    });
  });
}

