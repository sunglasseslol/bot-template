/**
 * Pagination Utility Module
 *
 * Provides utilities for creating paginated embeds and messages.
 * Useful for displaying long lists of commands, users, etc.
 */

import { EmbedBuilder, Message, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { createEmbed } from './embeds';

export interface PaginationOptions {
  /**
   * Items to paginate
   */
  items: string[];

  /**
   * Items per page
   */
  itemsPerPage?: number;

  /**
   * Embed title
   */
  title: string;

  /**
   * Embed description (shown on all pages)
   */
  description?: string;

  /**
   * Format function for items
   */
  formatItem?: (item: string, index: number) => string;

  /**
   * Timeout in milliseconds (default: 60000 = 1 minute)
   */
  timeout?: number;
}

/**
 * Creates a paginated embed message
 * @param message - The message to reply to
 * @param options - Pagination options
 */
export async function createPaginatedEmbed(
  message: Message,
  options: PaginationOptions
): Promise<void> {
  const {
    items,
    itemsPerPage = 10,
    title,
    description,
    formatItem = (item) => item,
    timeout = 60000,
  } = options;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  let currentPage = 1;

  // Create initial embed
  const getEmbed = (page: number): EmbedBuilder => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);
    const pageItems = items.slice(startIndex, endIndex);

    const embed = createEmbed(
      `${title} (Page ${page}/${totalPages})`,
      description
    );

    const content = pageItems
      .map((item, index) => formatItem(item, startIndex + index))
      .join('\n');

    embed.addFields({
      name: '\u200b',
      value: content || 'No items to display',
      inline: false,
    });

    return embed;
  };

  // Create navigation buttons
  const getButtons = (): ActionRowBuilder<ButtonBuilder> => {
    const row = new ActionRowBuilder<ButtonBuilder>();

    row.addComponents(
      new ButtonBuilder()
        .setCustomId('pagination_first')
        .setLabel('⏮️ First')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === 1),
      new ButtonBuilder()
        .setCustomId('pagination_prev')
        .setLabel('◀️ Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === 1),
      new ButtonBuilder()
        .setCustomId('pagination_next')
        .setLabel('Next ▶️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === totalPages),
      new ButtonBuilder()
        .setCustomId('pagination_last')
        .setLabel('Last ⏭️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === totalPages)
    );

    return row;
  };

  // Send initial message
  const sentMessage = await message.reply({
    embeds: [getEmbed(currentPage)],
    components: totalPages > 1 ? [getButtons()] : [],
  });

  // Only set up collector if there are multiple pages
  if (totalPages <= 1) {
    return;
  }

  // Create button collector
  const collector = sentMessage.createMessageComponentCollector({
    filter: (interaction) => interaction.user.id === message.author.id,
    time: timeout,
  });

  collector.on('collect', async (interaction) => {
    if (!interaction.isButton()) return;

    switch (interaction.customId) {
      case 'pagination_first':
        currentPage = 1;
        break;
      case 'pagination_prev':
        if (currentPage > 1) currentPage--;
        break;
      case 'pagination_next':
        if (currentPage < totalPages) currentPage++;
        break;
      case 'pagination_last':
        currentPage = totalPages;
        break;
    }

    await interaction.update({
      embeds: [getEmbed(currentPage)],
      components: [getButtons()],
    });
  });

  collector.on('end', async () => {
    // Disable buttons when collector ends
    const disabledRow = new ActionRowBuilder<ButtonBuilder>();
    disabledRow.addComponents(
      new ButtonBuilder()
        .setCustomId('pagination_first')
        .setLabel('⏮️ First')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('pagination_prev')
        .setLabel('◀️ Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('pagination_next')
        .setLabel('Next ▶️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('pagination_last')
        .setLabel('Last ⏭️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
    );

    try {
      await sentMessage.edit({
        components: [disabledRow],
      });
    } catch {
      // Message may have been deleted, ignore
    }
  });
}

