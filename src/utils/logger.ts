/**
 * Logger Utility Module
 * 
 * Provides a simple logging system with different log levels.
 * Can be extended to use a proper logging library like Winston or Pino.
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Logger class for consistent logging throughout the application
 */
class Logger {
  /**
   * Logs a debug message
   * @param message - The message to log
   * @param data - Optional additional data to log
   */
  debug(message: string, ...data: unknown[]): void {
    this.log(LogLevel.DEBUG, message, ...data);
  }

  /**
   * Logs an info message
   * @param message - The message to log
   * @param data - Optional additional data to log
   */
  info(message: string, ...data: unknown[]): void {
    this.log(LogLevel.INFO, message, ...data);
  }

  /**
   * Logs a warning message
   * @param message - The message to log
   * @param data - Optional additional data to log
   */
  warn(message: string, ...data: unknown[]): void {
    this.log(LogLevel.WARN, message, ...data);
  }

  /**
   * Logs an error message
   * @param message - The message to log
   * @param error - Optional error object
   */
  error(message: string, error?: Error | unknown): void {
    this.log(LogLevel.ERROR, message, error);
  }

  /**
   * Internal logging method
   * Formats and outputs log messages with timestamps
   */
  private log(level: LogLevel, message: string, ...data: unknown[]): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;

    // Only log debug messages in development
    if (level === LogLevel.DEBUG && process.env.NODE_ENV === 'production') {
      return;
    }

    // Format the log message
    const logMessage = `${prefix} ${message}`;

    // Output to console with appropriate method
    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage, ...data);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, ...data);
        break;
      default:
        console.log(logMessage, ...data);
    }
  }
}

// Export a singleton logger instance
export const logger = new Logger();

