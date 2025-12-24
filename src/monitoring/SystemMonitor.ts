/**
 * System Monitor Module
 *
 * Tracks system-level metrics like CPU usage, memory usage, uptime, etc.
 * Provides real-time system statistics without database dependencies.
 */

import os from 'os';
import { logger } from '../utils/logger';

export interface SystemStats {
  cpu: {
    usage: number; // CPU usage percentage (0-100)
    cores: number; // Number of CPU cores
    model: string; // CPU model name
  };
  memory: {
    total: number; // Total memory in bytes
    free: number; // Free memory in bytes
    used: number; // Used memory in bytes
    usage: number; // Memory usage percentage (0-100)
  };
  uptime: {
    system: number; // System uptime in seconds
    process: number; // Process uptime in seconds
  };
  platform: {
    type: string; // Platform type (e.g., 'linux', 'darwin', 'win32')
    arch: string; // Architecture (e.g., 'x64', 'arm64')
    hostname: string; // System hostname
  };
  nodejs: {
    version: string; // Node.js version
    pid: number; // Process ID
  };
}

/**
 * System Monitor class for tracking system resources
 */
export class SystemMonitor {
  private static startTime: number = Date.now();
  private static cpuUsageHistory: number[] = [];
  private static readonly MAX_HISTORY = 60; // Keep last 60 measurements

  /**
   * Gets current CPU usage percentage
   * Note: This is an approximation based on CPU time deltas
   */
  private static getCpuUsage(): number {
    const cpus = os.cpus();
    if (cpus.length === 0) return 0;

    // Calculate average CPU usage across all cores
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    }

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~((idle / total) * 100);

    return Math.max(0, Math.min(100, usage));
  }

  /**
   * Records a CPU usage measurement
   * Call this periodically to track CPU usage over time
   */
  public static recordCpuUsage(): void {
    const usage = this.getCpuUsage();
    this.cpuUsageHistory.push(usage);

    // Keep only the last MAX_HISTORY measurements
    if (this.cpuUsageHistory.length > this.MAX_HISTORY) {
      this.cpuUsageHistory.shift();
    }
  }

  /**
   * Gets average CPU usage over the recorded history
   * @returns Average CPU usage percentage
   */
  public static getAverageCpuUsage(): number {
    if (this.cpuUsageHistory.length === 0) {
      return this.getCpuUsage();
    }

    const sum = this.cpuUsageHistory.reduce((a, b) => a + b, 0);
    return sum / this.cpuUsageHistory.length;
  }

  /**
   * Gets comprehensive system statistics
   * @returns System statistics object
   */
  public static getStats(): SystemStats {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = (usedMemory / totalMemory) * 100;

    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : 'Unknown';

    return {
      cpu: {
        usage: this.getCpuUsage(),
        cores: cpus.length,
        model: cpuModel,
      },
      memory: {
        total: totalMemory,
        free: freeMemory,
        used: usedMemory,
        usage: memoryUsage,
      },
      uptime: {
        system: Math.floor(os.uptime()),
        process: Math.floor((Date.now() - this.startTime) / 1000),
      },
      platform: {
        type: os.type(),
        arch: os.arch(),
        hostname: os.hostname(),
      },
      nodejs: {
        version: process.version,
        pid: process.pid,
      },
    };
  }

  /**
   * Gets formatted system statistics as a string
   * Useful for logging or displaying in commands
   * @returns Formatted string with system stats
   */
  public static getFormattedStats(): string {
    const stats = this.getStats();

    const formatBytes = (bytes: number): string => {
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 B';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatUptime = (seconds: number): string => {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`;
      if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
      if (minutes > 0) return `${minutes}m ${secs}s`;
      return `${secs}s`;
    };

    return [
      '**System Statistics**',
      `**CPU:** ${stats.cpu.usage.toFixed(1)}% usage (${stats.cpu.cores} cores)`,
      `**Memory:** ${stats.memory.usage.toFixed(1)}% used (${formatBytes(stats.memory.used)} / ${formatBytes(stats.memory.total)})`,
      `**Uptime:** System: ${formatUptime(stats.uptime.system)}, Process: ${formatUptime(stats.uptime.process)}`,
      `**Platform:** ${stats.platform.type} ${stats.platform.arch} (${stats.platform.hostname})`,
      `**Node.js:** ${stats.nodejs.version} (PID: ${stats.nodejs.pid})`,
    ].join('\n');
  }

  /**
   * Starts periodic CPU usage tracking
   * @param intervalMs - Interval in milliseconds (default: 5000)
   */
  public static startTracking(intervalMs: number = 5000): NodeJS.Timeout {
    logger.info(`Starting system monitoring (interval: ${intervalMs}ms)`);

    return setInterval(() => {
      try {
        this.recordCpuUsage();
      } catch (error) {
        logger.error('Error recording CPU usage:', error);
      }
    }, intervalMs);
  }

  /**
   * Stops periodic CPU usage tracking
   * @param intervalId - The interval ID returned from startTracking
   */
  public static stopTracking(intervalId: NodeJS.Timeout): void {
    clearInterval(intervalId);
    logger.info('Stopped system monitoring');
  }
}

