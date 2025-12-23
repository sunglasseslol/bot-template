/**
 * Message Create Event Handler
 * 
 * This event is fired whenever a message is created in a channel
 * the bot can see. This is where prefix commands are handled.
 */

import { Events, Message } from 'discord.js';
import { logger } from '../utils/logger';
import { CommandManager } from '../managers/CommandManager';
import { config } from '../config';

/**
 * Handles incoming messages and checks for prefix commands
 * @param message - The message that was created
 * @param commandManager - The command manager instance
 */
export async function handleMessageCreate(
  message: Message,
  commandManager: CommandManager
): Promise<void> {
  // Ignore messages from bots
  if (message.author.bot) {
    return;
  }

  // Ignore messages that don't start with the prefix
  if (!message.content.startsWith(config.BOT_PREFIX)) {
    return;
  }

  // Handle the prefix command
  await commandManager.handlePrefixCommand(message, config.BOT_PREFIX);
}

/**
 * Registers the message create event listener
 * @param client - The Discord client instance
 * @param commandManager - The command manager instance
 */
export function registerMessageCreateEvent(
  client: import('discord.js').Client,
  commandManager: CommandManager
): void {
  client.on(Events.MessageCreate, (message: Message) => {
    handleMessageCreate(message, commandManager).catch((error) => {
      logger.error('Error in message create event handler:', error);
    });
  });
}

