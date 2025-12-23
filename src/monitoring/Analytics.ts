/**
 * Analytics Module
 *
 * Tracks command usage, user activity, and bot statistics.
 * Provides insights into bot usage patterns.
 */

import { prisma } from '../utils/database';
import { logger } from '../utils/logger';

export interface CommandUsageData {
  guildId?: string;
  userId: string;
  command: string;
  type: 'prefix' | 'slash';
  args?: string;
  success: boolean;
  error?: string;
  duration?: number;
}

export interface GuildEventData {
  guildId: string;
  eventType: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Analytics class for tracking bot usage and events
 */
export class Analytics {
  /**
   * Records a command usage
   * @param data - Command usage data
   */
  public static async recordCommandUsage(data: CommandUsageData): Promise<void> {
    try {
      // Get guild ID from database if provided
      let guildDbId: string | undefined;
      if (data.guildId) {
        const guild = await prisma.guild.findUnique({
          where: { discordId: data.guildId },
        });
        guildDbId = guild?.id;
      }

      await prisma.commandUsage.create({
        data: {
          guildId: guildDbId,
          userId: data.userId,
          command: data.command,
          type: data.type,
          args: data.args,
          success: data.success,
          error: data.error,
          duration: data.duration,
        },
      });
    } catch (error) {
      logger.error('Failed to record command usage:', error);
    }
  }

  /**
   * Records a guild event
   * @param data - Guild event data
   */
  public static async recordGuildEvent(data: GuildEventData): Promise<void> {
    try {
      // Get or create guild
      let guild = await prisma.guild.findUnique({
        where: { discordId: data.guildId },
      });

      if (!guild) {
        // Guild not in database yet, create it
        guild = await prisma.guild.create({
          data: {
            discordId: data.guildId,
            name: 'Unknown', // Will be updated when guild info is fetched
          },
        });
      }

      await prisma.guildEvent.create({
        data: {
          guildId: guild.id,
          eventType: data.eventType,
          userId: data.userId,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        },
      });
    } catch (error) {
      logger.error('Failed to record guild event:', error);
    }
  }

  /**
   * Gets command usage statistics
   * @param guildId - Optional guild ID to filter by
   * @param days - Number of days to look back (default: 7)
   * @returns Command usage statistics
   */
  public static async getCommandStats(guildId?: string, days = 7): Promise<
    Array<{
      command: string;
      count: number;
      successRate: number;
      avgDuration: number;
    }>
  > {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const where: { createdAt: { gte: Date }; guildId?: string } = {
        createdAt: { gte: since },
      };

      if (guildId) {
        const guild = await prisma.guild.findUnique({
          where: { discordId: guildId },
        });
        if (guild) {
          where.guildId = guild.id;
        }
      }

      const usages = await prisma.commandUsage.findMany({
        where,
        select: {
          command: true,
          success: true,
          duration: true,
        },
      });

      // Aggregate statistics
      const stats = new Map<
        string,
        { count: number; successes: number; durations: number[] }
      >();

      for (const usage of usages) {
        if (!stats.has(usage.command)) {
          stats.set(usage.command, { count: 0, successes: 0, durations: [] });
        }

        const stat = stats.get(usage.command)!;
        stat.count++;
        if (usage.success) stat.successes++;
        if (usage.duration) stat.durations.push(usage.duration);
      }

      return Array.from(stats.entries()).map(([command, stat]) => ({
        command,
        count: stat.count,
        successRate: stat.count > 0 ? stat.successes / stat.count : 0,
        avgDuration:
          stat.durations.length > 0
            ? stat.durations.reduce((a, b) => a + b, 0) / stat.durations.length
            : 0,
      }));
    } catch (error) {
      logger.error('Failed to get command stats:', error);
      return [];
    }
  }

  /**
   * Gets total command usage count
   * @param guildId - Optional guild ID to filter by
   * @param days - Number of days to look back
   * @returns Total command count
   */
  public static async getTotalCommandCount(guildId?: string, days?: number): Promise<number> {
    try {
      const where: { guildId?: string; createdAt?: { gte: Date } } = {};

      if (guildId) {
        const guild = await prisma.guild.findUnique({
          where: { discordId: guildId },
        });
        if (guild) {
          where.guildId = guild.id;
        }
      }

      if (days) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        where.createdAt = { gte: since };
      }

      return await prisma.commandUsage.count({ where });
    } catch (error) {
      logger.error('Failed to get total command count:', error);
      return 0;
    }
  }

  /**
   * Gets most used commands
   * @param limit - Number of commands to return (default: 10)
   * @param guildId - Optional guild ID to filter by
   * @returns Array of most used commands
   */
  public static async getMostUsedCommands(
    limit = 10,
    guildId?: string
  ): Promise<Array<{ command: string; count: number }>> {
    try {
      const where: { guildId?: string } = {};

      if (guildId) {
        const guild = await prisma.guild.findUnique({
          where: { discordId: guildId },
        });
        if (guild) {
          where.guildId = guild.id;
        }
      }

      const results = await prisma.commandUsage.groupBy({
        by: ['command'],
        where,
        _count: {
          command: true,
        },
        orderBy: {
          _count: {
            command: 'desc',
          },
        },
        take: limit,
      });

      return results.map((r) => ({
        command: r.command,
        count: r._count.command,
      }));
    } catch (error) {
      logger.error('Failed to get most used commands:', error);
      return [];
    }
  }
}

