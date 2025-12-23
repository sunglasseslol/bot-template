/**
 * Validation Utility Module
 *
 * Provides utilities for validating user input and data.
 * Useful for command argument validation and data sanitization.
 */

/**
 * Validates if a string is a valid Discord user ID
 * @param id - String to validate
 * @returns Whether the string is a valid Discord user ID
 */
export function isValidUserId(id: string): boolean {
  return /^\d{17,19}$/.test(id);
}

/**
 * Validates if a string is a valid Discord channel ID
 * @param id - String to validate
 * @returns Whether the string is a valid Discord channel ID
 */
export function isValidChannelId(id: string): boolean {
  return /^\d{17,19}$/.test(id);
}

/**
 * Validates if a string is a valid Discord role ID
 * @param id - String to validate
 * @returns Whether the string is a valid Discord role ID
 */
export function isValidRoleId(id: string): boolean {
  return /^\d{17,19}$/.test(id);
}

/**
 * Validates if a string is a valid Discord guild ID
 * @param id - String to validate
 * @returns Whether the string is a valid Discord guild ID
 */
export function isValidGuildId(id: string): boolean {
  return /^\d{17,19}$/.test(id);
}

/**
 * Validates if a string is a valid Discord snowflake (any ID)
 * @param id - String to validate
 * @returns Whether the string is a valid Discord snowflake
 */
export function isValidSnowflake(id: string): boolean {
  return /^\d{17,19}$/.test(id);
}

/**
 * Validates if a string is a valid URL
 * @param url - String to validate
 * @returns Whether the string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates if a string is a valid email address
 * @param email - String to validate
 * @returns Whether the string is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a number is within a range
 * @param value - Number to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Whether the number is within the range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validates if a string length is within a range
 * @param str - String to validate
 * @param min - Minimum length (inclusive)
 * @param max - Maximum length (inclusive)
 * @returns Whether the string length is within the range
 */
export function isLengthInRange(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

/**
 * Sanitizes a string by removing potentially dangerous characters
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  return (
    input
      .replace(/[<>]/g, '') // Remove angle brackets
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .trim()
  );
}

/**
 * Validates command arguments
 * @param args - Arguments array
 * @param expectedCount - Expected number of arguments
 * @param minCount - Minimum number of arguments (defaults to expectedCount)
 * @returns Whether arguments are valid
 */
export function validateArgs(args: string[], expectedCount: number, minCount?: number): boolean {
  const min = minCount ?? expectedCount;
  return args.length >= min && args.length <= expectedCount;
}

/**
 * Extracts user mention or ID from a string
 * @param input - String containing user mention or ID
 * @returns User ID or null if invalid
 */
export function extractUserId(input: string): string | null {
  // Check for mention format: <@123456789> or <@!123456789>
  const mentionMatch = input.match(/<@!?(\d+)>/);
  if (mentionMatch) {
    return mentionMatch[1];
  }

  // Check if it's a plain ID
  if (isValidUserId(input)) {
    return input;
  }

  return null;
}

/**
 * Extracts channel mention or ID from a string
 * @param input - String containing channel mention or ID
 * @returns Channel ID or null if invalid
 */
export function extractChannelId(input: string): string | null {
  // Check for mention format: <#123456789>
  const mentionMatch = input.match(/<#(\d+)>/);
  if (mentionMatch) {
    return mentionMatch[1];
  }

  // Check if it's a plain ID
  if (isValidChannelId(input)) {
    return input;
  }

  return null;
}

/**
 * Extracts role mention or ID from a string
 * @param input - String containing role mention or ID
 * @returns Role ID or null if invalid
 */
export function extractRoleId(input: string): string | null {
  // Check for mention format: <@&123456789>
  const mentionMatch = input.match(/<@&(\d+)>/);
  if (mentionMatch) {
    return mentionMatch[1];
  }

  // Check if it's a plain ID
  if (isValidRoleId(input)) {
    return input;
  }

  return null;
}
