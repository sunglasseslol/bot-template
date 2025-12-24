/**
 * Guild Member Add Event Handler
 *
 * This event is fired when a member joins a server.
 * Useful for welcome messages, role assignment, and logging.
 */

import { Events, GuildMember } from 'discord.js';
import { logger } from '../utils/logger';
import { prisma } from '../utils/database';
import { isFeatureEnabled, botConfig } from '../config';
import { createEmbed } from '../utils/embeds';
import { formatRelativeTime } from '../utils/time';

/**
 * Handles the guild member add event
 * @param member - The member that joined
 */
export async function handleGuildMemberAdd(member: GuildMember): Promise<void> {
  try {
    logger.info(`Member joined: ${member.user.tag} in ${member.guild.name}`);

    // Create or update user in database
    await prisma.user.upsert({
      where: { discordId: member.user.id },
      update: {
        username: member.user.username,
        discriminator: member.user.discriminator,
        avatar: member.user.avatar,
      },
      create: {
        discordId: member.user.id,
        username: member.user.username,
        discriminator: member.user.discriminator,
        avatar: member.user.avatar,
      },
    });

    // Send welcome message if enabled
    if (isFeatureEnabled('enableWelcomeMessages') && botConfig.channels?.welcomeChannel) {
      try {
        const welcomeChannel = member.guild.channels.cache.get(
          botConfig.channels.welcomeChannel
        );

        if (welcomeChannel && welcomeChannel.isTextBased()) {
          const embed = createEmbed(
            `Welcome to ${member.guild.name}!`,
            `Welcome ${member.user.toString()}!\n\n` +
              `You are member #${member.guild.memberCount}\n` +
              `Account created: ${formatRelativeTime(member.user.createdAt)}`
          );

          await welcomeChannel.send({
            content: `Welcome ${member.user.toString()}!`,
            embeds: [embed],
          });
        }
      } catch (error) {
        logger.error('Failed to send welcome message:', error);
      }
    }
  } catch (error) {
    logger.error('Error handling guild member add event:', error);
  }
}

/**
 * Registers the guild member add event listener
 * @param client - The Discord client instance
 */
export function registerGuildMemberAddEvent(client: import('discord.js').Client): void {
  client.on(Events.GuildMemberAdd, (member: GuildMember) => {
    handleGuildMemberAdd(member).catch((error) => {
      logger.error('Error in guild member add event handler:', error);
    });
  });
}

