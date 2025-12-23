/**
 * Help Command
 *
 * Displays a list of available commands. This command demonstrates
 * how to create both prefix and slash command handlers that work
 * independently of each other.
 */

import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command, CommandContext } from '../types/command';
import { config } from '../config';

/**
 * Help command implementation
 * Shows available commands and their descriptions
 */
export const helpCommand: Command = {
  name: 'help',
  aliases: ['h', 'commands'],
  description: 'Shows a list of available commands',
  usage: '!help [command]',
  category: 'utility',

  // Slash command definition
  slashCommand: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows a list of available commands')
    .addStringOption((option) =>
      option.setName('command').setDescription('Get help for a specific command').setRequired(false)
    ) as SlashCommandBuilder,

  // Prefix command handler
  async execute(context: CommandContext): Promise<void> {
    const { message } = context;
    if (!message) return;

    // Help response for prefix commands
    const embed = new EmbedBuilder()
      .setTitle('📚 Command Help')
      .setDescription(
        `**Prefix Commands** (use \`${context.prefix}<command>\`):\n` +
          `• \`${context.prefix}ping\` - Check bot latency\n` +
          `• \`${context.prefix}info\` - View bot information\n` +
          `• \`${context.prefix}help\` - Show this help message\n` +
          `• \`${context.prefix}prefixonly\` - Example prefix-only command\n\n` +
          `**Slash Commands** (use \`/\` in Discord):\n` +
          `• \`/ping\` - Check bot latency\n` +
          `• \`/info\` - View bot information\n` +
          `• \`/help\` - Show help message\n` +
          `• \`/slashonly\` - Example slash-only command\n\n` +
          `**Note:** Some commands support both prefix and slash, while others are exclusive to one type.`
      )
      .setColor(0x5865f2)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  },

  // Slash command handler
  async slashExecute(interaction: ChatInputCommandInteraction): Promise<void> {
    const commandName = interaction.options.getString('command');

    if (commandName) {
      // Show help for specific command
      const embed = new EmbedBuilder()
        .setTitle(`Help: ${commandName}`)
        .setDescription(
          `Use \`/\` to see slash commands or \`${config.BOT_PREFIX}\` for prefix commands.`
        )
        .setColor(0x5865f2);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      // Show general help
      const embed = new EmbedBuilder()
        .setTitle('📚 Command Help')
        .setDescription(
          `**Slash Commands** (use \`/\` in Discord):\n` +
            `• \`/ping\` - Check bot latency\n` +
            `• \`/info\` - View bot information\n` +
            `• \`/help\` - Show this help message\n` +
            `• \`/slashonly\` - Example slash-only command\n\n` +
            `**Prefix Commands** (use \`${config.BOT_PREFIX}<command>\`):\n` +
            `• \`${config.BOT_PREFIX}ping\` - Check bot latency\n` +
            `• \`${config.BOT_PREFIX}info\` - View bot information\n` +
            `• \`${config.BOT_PREFIX}help\` - Show help message\n` +
            `• \`${config.BOT_PREFIX}prefixonly\` - Example prefix-only command\n\n` +
            `**Note:** Some commands support both prefix and slash, while others are exclusive to one type.`
        )
        .setColor(0x5865f2)
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
