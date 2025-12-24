/**
 * Command Manager Module
 *
 * This module handles command registration, discovery, and execution.
 * It provides a centralized system for managing all bot commands,
 * making it easy to add new commands without modifying core bot code.
 */

import {
  ChatInputCommandInteraction,
  Collection,
  Message,
  PermissionsBitField,
  REST,
  Routes,
} from 'discord.js';
import { Command, CommandContext } from '../types/command';
import { logger } from '../utils/logger';

/**
 * Command Manager class
 * Handles all command-related operations
 */
export class CommandManager {
  /**
   * Collection of registered commands
   * Key: command name, Value: command object
   */
  private commands: Collection<string, Command> = new Collection();

  /**
   * Collection tracking command cooldowns
   * Key: "userId-commandName", Value: timestamp when cooldown expires
   */
  private cooldowns: Collection<string, number> = new Collection();

  /**
   * Registers a command with the manager
   * @param command - The command object to register
   */
  public registerCommand(command: Command): void {
    // Validate command has required properties
    if (!command.name || !command.description) {
      logger.warn(`Skipping command registration: missing name or description`, command);
      return;
    }

    // Register the command by its name
    this.commands.set(command.name.toLowerCase(), command);

    // Also register aliases if they exist
    if (command.aliases) {
      for (const alias of command.aliases) {
        this.commands.set(alias.toLowerCase(), command);
      }
    }

    logger.info(`Registered command: ${command.name}`);
  }

  /**
   * Registers multiple commands at once
   * @param commands - Array of command objects to register
   */
  public registerCommands(commands: Command[]): void {
    for (const command of commands) {
      this.registerCommand(command);
    }
  }

  /**
   * Gets a command by name
   * @param name - The name or alias of the command
   * @returns The command object or undefined if not found
   */
  public getCommand(name: string): Command | undefined {
    return this.commands.get(name.toLowerCase());
  }

  /**
   * Gets all registered commands
   * @returns Collection of all commands
   */
  public getAllCommands(): Collection<string, Command> {
    return this.commands;
  }

  /**
   * Gets commands by category
   * @param category - The category to filter by
   * @returns Array of commands in the specified category
   */
  public getCommandsByCategory(category: string): Command[] {
    return this.commands
      .filter((cmd: Command) => cmd.category === category)
      .map((cmd: Command) => cmd);
  }

  /**
   * Handles prefix command execution
   * @param message - The Discord message that triggered the command
   * @param prefix - The prefix used to trigger the command
   */
  public async handlePrefixCommand(message: Message, prefix: string): Promise<void> {
    // Parse command and arguments from message
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) {
      return;
    }

    // Get the command
    const command = this.getCommand(commandName);
    if (!command) {
      return;
    }

    // Check if command can be executed in DMs
    if (command.guildOnly && !message.guild) {
      await message.reply('This command can only be used in a server.');
      return;
    }

    // Check permissions
    if (command.adminOnly && message.member) {
      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        await message.reply('You do not have permission to use this command.');
        return;
      }
    }

    // Check cooldown
    if (command.cooldown) {
      const cooldownKey = `${message.author.id}-${command.name}`;
      const cooldownEnd = this.cooldowns.get(cooldownKey);

      if (cooldownEnd && Date.now() < cooldownEnd) {
        const timeLeft = Math.ceil((cooldownEnd - Date.now()) / 1000);
        await message.reply(`Please wait ${timeLeft} second(s) before using this command again.`);
        return;
      }

      // Set cooldown
      this.cooldowns.set(cooldownKey, Date.now() + command.cooldown * 1000);
    }

    // Create command context
    const context: CommandContext = {
      message,
      args,
      prefix,
    };

    // Execute the command
    try {
      if (command.execute) {
        await command.execute(context);
      } else {
        await message.reply('This command does not support prefix execution.');
      }
    } catch (error) {
      logger.error(`Error executing command ${command.name}:`, error);
      await message.reply('An error occurred while executing the command.');
    }
  }

  /**
   * Handles slash command execution
   * @param interaction - The slash command interaction
   */
  public async handleSlashCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const commandName = interaction.commandName.toLowerCase();
    const command = this.getCommand(commandName);

    if (!command || !command.slashExecute) {
      await interaction.reply({
        content: 'This command is not available.',
        ephemeral: true,
      });
      return;
    }

    // Check if command can be executed in DMs
    if (command.guildOnly && !interaction.guild) {
      await interaction.reply({
        content: 'This command can only be used in a server.',
        ephemeral: true,
      });
      return;
    }

    // Check permissions
    if (command.adminOnly) {
      const memberPermissions = interaction.memberPermissions;
      if (!memberPermissions || !memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
        await interaction.reply({
          content: 'You do not have permission to use this command.',
          ephemeral: true,
        });
        return;
      }
    }

    // Execute the command
    try {
      await command.slashExecute(interaction);
    } catch (error) {
      logger.error(`Error executing slash command ${command.name}:`, error);

      const reply = interaction.replied || interaction.deferred;
      if (reply) {
        await interaction.followUp({
          content: 'An error occurred while executing the command.',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'An error occurred while executing the command.',
          ephemeral: true,
        });
      }
    }
  }

  /**
   * Registers slash commands with Discord
   * @param clientId - The Discord client ID
   * @param token - The Discord bot token
   * @param guildId - Optional guild ID for guild-specific commands
   */
  public async registerSlashCommands(
    clientId: string,
    token: string,
    guildId?: string
  ): Promise<void> {
    // Get unique commands (avoid duplicates from aliases)
    // Only include commands where the key matches the command name (not aliases)
    const uniqueCommands = new Set<Command>();
    for (const [key, command] of this.commands) {
      // Only add if this is the main command name, not an alias
      if (command.name.toLowerCase() === key.toLowerCase() && command.slashCommand) {
        uniqueCommands.add(command);
      }
    }

    const slashCommands = Array.from(uniqueCommands).map((cmd: Command) =>
      cmd.slashCommand!.toJSON()
    );

    if (slashCommands.length === 0) {
      logger.info('No slash commands to register');
      return;
    }

    const rest = new REST().setToken(token);

    try {
      logger.info(`Registering ${slashCommands.length} slash command(s)...`);

      // Register commands globally or for a specific guild
      const route = guildId
        ? Routes.applicationGuildCommands(clientId, guildId)
        : Routes.applicationCommands(clientId);

      await rest.put(route, { body: slashCommands });

      logger.info('Successfully registered slash commands');
    } catch (error) {
      logger.error('Error registering slash commands:', error);
      throw error;
    }
  }
}
