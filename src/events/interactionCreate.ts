/**
 * Interaction Create Event Handler
 * 
 * This event is fired whenever a user interacts with the bot,
 * including slash commands, buttons, select menus, etc.
 * This is where slash commands are handled.
 */

import { Events, Interaction } from 'discord.js';
import { logger } from '../utils/logger';
import { CommandManager } from '../managers/CommandManager';

/**
 * Handles incoming interactions
 * @param interaction - The interaction that was created
 * @param commandManager - The command manager instance
 */
export async function handleInteractionCreate(
  interaction: Interaction,
  commandManager: CommandManager
): Promise<void> {
  // Handle slash commands
  if (interaction.isChatInputCommand()) {
    await commandManager.handleSlashCommand(interaction);
    return;
  }

  // Handle other interaction types here (buttons, select menus, etc.)
  // Example:
  // if (interaction.isButton()) {
  //   // Handle button interaction
  // }
}

/**
 * Registers the interaction create event listener
 * @param client - The Discord client instance
 * @param commandManager - The command manager instance
 */
export function registerInteractionCreateEvent(
  client: import('discord.js').Client,
  commandManager: CommandManager
): void {
  client.on(Events.InteractionCreate, (interaction: Interaction) => {
    handleInteractionCreate(interaction, commandManager).catch((error) => {
      logger.error('Error in interaction create event handler:', error);
    });
  });
}

