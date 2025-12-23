/**
 * Embed Utility Module
 *
 * Provides helper functions for creating consistent Discord embeds
 * using the bot's configuration for colors and styling.
 */

import { EmbedBuilder, ColorResolvable } from 'discord.js';
import { getEmbedColor, botConfig } from '../config/botConfig';

/**
 * Creates a default embed with bot branding
 * @param title - Embed title
 * @param description - Embed description
 * @returns EmbedBuilder instance
 */
export function createEmbed(title?: string, description?: string): EmbedBuilder {
  const embed = new EmbedBuilder().setColor(getEmbedColor('default') as ColorResolvable);

  if (title) {
    embed.setTitle(title);
  }

  if (description) {
    embed.setDescription(description);
  }

  // Add footer if configured
  if (botConfig.bot.footer) {
    embed.setFooter({ text: botConfig.bot.footer });
  }

  embed.setTimestamp();

  return embed;
}

/**
 * Creates an error embed
 * @param title - Error title (defaults to "Error")
 * @param description - Error description
 * @returns EmbedBuilder instance
 */
export function createErrorEmbed(title = 'Error', description: string): EmbedBuilder {
  return createEmbed(title, description).setColor(getEmbedColor('error') as ColorResolvable);
}

/**
 * Creates a success embed
 * @param title - Success title (defaults to "Success")
 * @param description - Success description
 * @returns EmbedBuilder instance
 */
export function createSuccessEmbed(title = 'Success', description: string): EmbedBuilder {
  return createEmbed(title, description).setColor(getEmbedColor('success') as ColorResolvable);
}

/**
 * Creates a warning embed
 * @param title - Warning title (defaults to "Warning")
 * @param description - Warning description
 * @returns EmbedBuilder instance
 */
export function createWarningEmbed(title = 'Warning', description: string): EmbedBuilder {
  return createEmbed(title, description).setColor(getEmbedColor('warning') as ColorResolvable);
}

/**
 * Creates an info embed
 * @param title - Info title
 * @param description - Info description
 * @returns EmbedBuilder instance
 */
export function createInfoEmbed(title: string, description: string): EmbedBuilder {
  return createEmbed(title, description);
}

