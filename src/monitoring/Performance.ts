/**
 * Performance Monitoring Module
 *
 * Tracks performance metrics for commands, database queries, and API calls.
 * Helps identify bottlenecks and optimize bot performance.
 */

import { prisma } from '../utils/database';
import { logger } from '../utils/logger';

export interface PerformanceMetricData {
  metricType: 'command_execution' | 'database_query' | 'api_call' | 'event_handler' | 'other';
  name: string;
  duration: number;
  success: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Performance monitoring class
 */
export class Performance {
  /**
   * Records a performance metric
   * @param data - Performance metric data
   */
  public static async recordMetric(data: PerformanceMetricData): Promise<void> {
    try {
      await prisma.performanceMetric.create({
        data: {
          metricType: data.metricType,
          name: data.name,
          duration: data.duration,
          success: data.success,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        },
      });
    } catch (error) {
      logger.error('Failed to record performance metric:', error);
    }
  }

  /**
   * Measures execution time of an async function
   * @param fn - Function to measure
   * @param metricType - Type of metric
   * @param name - Metric name
   * @returns Function result and duration
   */
  public static async measure<T>(
    fn: () => Promise<T>,
    metricType: PerformanceMetricData['metricType'],
    name: string
  ): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    let success = true;
    let result: T;

    try {
      result = await fn();
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = Date.now() - start;
      await this.recordMetric({
        metricType,
        name,
        duration,
        success,
      });
    }

    return { result: result!, duration: Date.now() - start };
  }

  /**
   * Gets average performance for a metric
   * @param metricType - Type of metric
   * @param name - Metric name
   * @param days - Number of days to look back (default: 7)
   * @returns Average duration and count
   */
  public static async getAveragePerformance(
    metricType: PerformanceMetricData['metricType'],
    name: string,
    days = 7
  ): Promise<{ avgDuration: number; count: number } | null> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const metrics = await prisma.performanceMetric.findMany({
        where: {
          metricType,
          name,
          createdAt: { gte: since },
          success: true,
        },
        select: {
          duration: true,
        },
      });

      if (metrics.length === 0) {
        return null;
      }

      const avgDuration =
        metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;

      return {
        avgDuration,
        count: metrics.length,
      };
    } catch (error) {
      logger.error('Failed to get average performance:', error);
      return null;
    }
  }

  /**
   * Gets slowest metrics
   * @param metricType - Type of metric to filter by
   * @param limit - Number of results to return (default: 10)
   * @returns Array of slowest metrics
   */
  public static async getSlowestMetrics(
    metricType?: PerformanceMetricData['metricType'],
    limit = 10
  ): Promise<
    Array<{
      metricType: string;
      name: string;
      duration: number;
      createdAt: Date;
    }>
  > {
    try {
      const where: { metricType?: string } = {};
      if (metricType) {
        where.metricType = metricType;
      }

      const metrics = await prisma.performanceMetric.findMany({
        where,
        orderBy: {
          duration: 'desc',
        },
        take: limit,
        select: {
          metricType: true,
          name: true,
          duration: true,
          createdAt: true,
        },
      });

      return metrics;
    } catch (error) {
      logger.error('Failed to get slowest metrics:', error);
      return [];
    }
  }
}

