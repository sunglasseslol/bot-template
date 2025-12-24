/**
 * Guild Member Remove Event Handler
 *
 * This event is fired when a member leaves a server (or is kicked/banned).
 * Useful for logging and cleanup.
 */

import { Events, GuildMember, PartialGuildMember } from 'discord.js';
import { logger } from '../utils/logger';

/**
 * Handles the guild member remove event
 * @param member - The member that left
 */
export async function handleGuildMemberRemove(
  member: GuildMember | PartialGuildMember
): Promise<void> {
  try {
    const username = member.user?.tag || 'Unknown User';
    logger.info(`Member left: ${username} from ${member.guild.name}`);
  } catch (error) {
    logger.error('Error handling guild member remove event:', error);
  }
}

/**
 * Registers the guild member remove event listener
 * @param client - The Discord client instance
 */
export function registerGuildMemberRemoveEvent(client: import('discord.js').Client): void {
  client.on(Events.GuildMemberRemove, (member: GuildMember | PartialGuildMember) => {
    handleGuildMemberRemove(member).catch((error) => {
      logger.error('Error in guild member remove event handler:', error);
    });
  });
}

