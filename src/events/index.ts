/**
 * Event Handlers Index
 * 
 * This file registers all event handlers with the Discord client.
 * To add a new event handler:
 * 1. Create a new file in the events directory
 * 2. Create a register function that takes client and commandManager
 * 3. Import and call it in the registerAllEvents function below
 */

import { Client } from 'discord.js';
import { CommandManager } from '../managers/CommandManager';
import { registerReadyEvent } from './ready';
import { registerMessageCreateEvent } from './messageCreate';
import { registerInteractionCreateEvent } from './interactionCreate';
import { registerGuildCreateEvent } from './guildCreate';
import { registerGuildDeleteEvent } from './guildDelete';
import { registerGuildMemberAddEvent } from './guildMemberAdd';
import { registerGuildMemberRemoveEvent } from './guildMemberRemove';
import { registerMessageReactionAddEvent } from './messageReactionAdd';
import { registerVoiceStateUpdateEvent } from './voiceStateUpdate';

/**
 * Registers all event handlers with the Discord client
 * @param client - The Discord client instance
 * @param commandManager - The command manager instance
 */
export function registerAllEvents(
  client: Client,
  commandManager: CommandManager
): void {
  // Core events
  registerReadyEvent(client, commandManager);
  registerMessageCreateEvent(client, commandManager);
  registerInteractionCreateEvent(client, commandManager);

  // Guild events
  registerGuildCreateEvent(client);
  registerGuildDeleteEvent(client);

  // Member events
  registerGuildMemberAddEvent(client);
  registerGuildMemberRemoveEvent(client);

  // Interaction events
  registerMessageReactionAddEvent(client);
  registerVoiceStateUpdateEvent(client);
}

