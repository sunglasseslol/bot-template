/**
 * Info Command
 *
 * Displays information about the bot, including uptime, server count, etc.
 * This demonstrates how to access bot statistics and format responses.
 */

import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command, CommandContext } from '../types/command';
import { prisma } from '../utils/database';

/**
 * Creates an embed with bot information
 * @param uptime - Bot uptime in milliseconds
 * @returns EmbedBuilder with bot information
 */
async function createInfoEmbed(uptime: number): Promise<EmbedBuilder> {
  // Format uptime
  const days = Math.floor(uptime / 86400000);
  const hours = Math.floor((uptime % 86400000) / 3600000);
  const minutes = Math.floor((uptime % 3600000) / 60000);
  const seconds = Math.floor((uptime % 60000) / 1000);
  const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  // Get database statistics (example)
  const userCount = await prisma.user.count().catch(() => 0);
  const guildCount = await prisma.guild.count().catch(() => 0);

  const embed = new EmbedBuilder()
    .setTitle('🤖 Bot Information')
    .setDescription('A modular Discord bot template built with TypeScript')
    .addFields(
      {
        name: '📊 Statistics',
        value: `**Servers:** ${guildCount}\n**Users:** ${userCount}\n**Uptime:** ${uptimeString}`,
        inline: false,
      },
      {
        name: '⚙️ Technology',
        value: 'TypeScript • Discord.js • Prisma • PostgreSQL',
        inline: false,
      }
    )
    .setTimestamp()
    .setColor(0x5865f2);

  return embed;
}

/**
 * Info command implementation
 * Shows bot information and statistics
 */
export const infoCommand: Command = {
  name: 'info',
  aliases: ['about', 'botinfo'],
  description: 'Displays information about the bot',
  usage: '!info',
  category: 'utility',

  // Slash command definition
  slashCommand: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Displays information about the bot'),

  // Prefix command handler
  async execute(context: CommandContext): Promise<void> {
    const { message } = context;
    if (!message) return;

    const embed = await createInfoEmbed(message.client.uptime || 0);
    await message.reply({ embeds: [embed] });
  },

  // Slash command handler
  async slashExecute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = await createInfoEmbed(interaction.client.uptime || 0);
    await interaction.reply({ embeds: [embed] });
  },
};
