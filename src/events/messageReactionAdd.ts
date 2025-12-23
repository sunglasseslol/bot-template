/**
 * Message Reaction Add Event Handler
 *
 * This event is fired when a user reacts to a message.
 * Useful for reaction roles, polls, and other interactive features.
 */

import { Events, MessageReaction, User } from 'discord.js';
import { logger } from '../utils/logger';
import { Performance } from '../monitoring';

/**
 * Handles the message reaction add event
 * @param reaction - The reaction that was added
 * @param user - The user who added the reaction
 */
export async function handleMessageReactionAdd(
  reaction: MessageReaction,
  user: User
): Promise<void> {
  try {
    // Ignore bot reactions
    if (user.bot) {
      return;
    }

    // Fetch the full message if partial
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch {
        // Message may have been deleted, ignore
        return;
      }
    }

    // Fetch the full message if partial
    if (reaction.message.partial) {
      try {
        await reaction.message.fetch();
      } catch {
        // Message may have been deleted, ignore
        return;
      }
    }

    // Example: Log reaction for analytics
    logger.debug(`Reaction added: ${reaction.emoji.name} by ${user.tag}`);

    // Here you can add custom logic like:
    // - Reaction roles
    // - Polls
    // - Starboard
    // - etc.
  } catch (error) {
    logger.error('Error handling message reaction add event:', error);
  }
}

/**
 * Registers the message reaction add event listener
 * @param client - The Discord client instance
 */
export function registerMessageReactionAddEvent(client: import('discord.js').Client): void {
  client.on(Events.MessageReactionAdd, (reaction: MessageReaction, user: User) => {
    Performance.measure(
      () => handleMessageReactionAdd(reaction, user),
      'event_handler',
      'message_reaction_add'
    ).catch((error) => {
      logger.error('Error in message reaction add event handler:', error);
    });
  });
}

