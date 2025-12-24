/**
 * Guild Create Event Handler
 *
 * This event is fired when the bot joins a new server (guild).
 * Useful for logging, initializing server settings, and sending welcome messages.
 */

import { Events, Guild } from 'discord.js';
import { logger } from '../utils/logger';
import { prisma } from '../utils/database';

/**
 * Handles the guild create event
 * @param guild - The guild that was joined
 */
export async function handleGuildCreate(guild: Guild): Promise<void> {
  try {
    logger.info(`Joined guild: ${guild.name} (${guild.id})`);

    // Create or update guild in database
    await prisma.guild.upsert({
      where: { discordId: guild.id },
      update: {
        name: guild.name,
      },
      create: {
        discordId: guild.id,
        name: guild.name,
      },
    });

    logger.info(`Guild ${guild.name} added to database`);
  } catch (error) {
    logger.error('Error handling guild create event:', error);
  }
}

/**
 * Registers the guild create event listener
 * @param client - The Discord client instance
 */
export function registerGuildCreateEvent(client: import('discord.js').Client): void {
  client.on(Events.GuildCreate, (guild: Guild) => {
    handleGuildCreate(guild).catch((error) => {
      logger.error('Error in guild create event handler:', error);
    });
  });
}

