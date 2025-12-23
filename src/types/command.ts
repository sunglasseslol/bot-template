/**
 * Command Type Definitions
 * 
 * This file defines the interfaces and types used for the command system.
 * All commands must implement the Command interface to be registered.
 */

import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

/**
 * Context object passed to command handlers
 * Contains all necessary information for command execution
 */
export interface CommandContext {
  /**
   * The Discord message that triggered the command (for prefix commands)
   */
  message?: Message;

  /**
   * The slash command interaction (for slash commands)
   */
  interaction?: ChatInputCommandInteraction;

  /**
   * The command arguments parsed from the message
   */
  args: string[];

  /**
   * The prefix used to trigger the command
   */
  prefix: string;
}

/**
 * Base interface that all commands must implement
 * This ensures consistency across all command types
 */
export interface Command {
  /**
   * The name of the command (used for prefix commands)
   * Example: "ping" would be triggered by "!ping"
   */
  name: string;

  /**
   * Alternative names/aliases for the command
   * Example: ["p", "latency"] would also trigger the command
   */
  aliases?: string[];

  /**
   * Description of what the command does
   * Used in help commands and slash command descriptions
   */
  description: string;

  /**
   * Usage example for the command
   * Example: "!ping [target]"
   */
  usage?: string;

  /**
   * Category/group the command belongs to
   * Useful for organizing commands in help menus
   */
  category?: string;

  /**
   * Whether the command requires administrator permissions
   */
  adminOnly?: boolean;

  /**
   * Whether the command can only be used in guilds (not DMs)
   */
  guildOnly?: boolean;

  /**
   * Cooldown in seconds before the command can be used again
   */
  cooldown?: number;

  /**
   * Slash command builder for Discord slash commands
   * If provided, the command will be registered as a slash command
   */
  slashCommand?:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder;

  /**
   * Handler function for prefix commands
   * Executed when a user types the command prefix + name
   */
  execute?: (context: CommandContext) => Promise<void> | void;

  /**
   * Handler function for slash commands
   * Executed when a user uses the slash command
   */
  slashExecute?: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
}

