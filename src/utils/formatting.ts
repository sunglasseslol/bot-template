/**
 * Formatting Utility Module
 *
 * Provides utilities for formatting text and data for Discord.
 * Useful for creating consistent, readable output.
 */

/**
 * Truncates a string to a maximum length with ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: "...")
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Escapes Discord markdown characters
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/([*_`~|\\])/g, '\\$1');
}

/**
 * Escapes Discord code block characters
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escapeCodeBlock(text: string): string {
  return text.replace(/```/g, '\\`\\`\\`');
}

/**
 * Formats a number with commas
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Formats a number as a percentage
 * @param num - Number to format (0-1 or 0-100)
 * @param isDecimal - Whether the number is already a decimal (0-1)
 * @returns Formatted percentage string
 */
export function formatPercentage(num: number, isDecimal = false): string {
  const percentage = isDecimal ? num * 100 : num;
  return `${percentage.toFixed(1)}%`;
}

/**
 * Formats bytes to human-readable size
 * @param bytes - Bytes to format
 * @param decimals - Number of decimal places
 * @returns Formatted size string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts a string to title case
 * @param str - String to convert
 * @returns Title case string
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Wraps text in a code block
 * @param code - Code to wrap
 * @param language - Language identifier (optional)
 * @returns Code block string
 */
export function codeBlock(code: string, language?: string): string {
  return `\`\`\`${language || ''}\n${code}\n\`\`\``;
}

/**
 * Wraps text in inline code
 * @param code - Code to wrap
 * @returns Inline code string
 */
export function inlineCode(code: string): string {
  return `\`${code}\``;
}

/**
 * Creates a progress bar
 * @param current - Current value
 * @param total - Total value
 * @param length - Bar length in characters
 * @param filled - Character for filled portion
 * @param empty - Character for empty portion
 * @returns Progress bar string
 */
export function createProgressBar(
  current: number,
  total: number,
  length = 20,
  filled = '█',
  empty = '░'
): string {
  const percentage = Math.min(Math.max(current / total, 0), 1);
  const filledLength = Math.round(length * percentage);
  const emptyLength = length - filledLength;

  return `${filled.repeat(filledLength)}${empty.repeat(emptyLength)} ${formatPercentage(percentage, true)}`;
}

/**
 * Formats a list of items into a numbered list
 * @param items - Array of items
 * @param start - Starting number (default: 1)
 * @returns Numbered list string
 */
export function formatNumberedList(items: string[], start = 1): string {
  return items.map((item, index) => `${start + index}. ${item}`).join('\n');
}

/**
 * Formats a list of items into a bullet list
 * @param items - Array of items
 * @param bullet - Bullet character (default: "•")
 * @returns Bullet list string
 */
export function formatBulletList(items: string[], bullet = '•'): string {
  return items.map((item) => `${bullet} ${item}`).join('\n');
}

/**
 * Removes extra whitespace and newlines from text
 * @param text - Text to clean
 * @returns Cleaned text
 */
export function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Splits text into chunks of maximum length
 * @param text - Text to split
 * @param maxLength - Maximum length per chunk
 * @returns Array of text chunks
 */
export function splitText(text: string, maxLength: number): string[] {
  const chunks: string[] = [];
  let currentChunk = '';

  const lines = text.split('\n');

  for (const line of lines) {
    if (currentChunk.length + line.length + 1 > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
      // If a single line is too long, split it
      if (line.length > maxLength) {
        let remainingLine = line;
        while (remainingLine.length > maxLength) {
          chunks.push(remainingLine.slice(0, maxLength));
          remainingLine = remainingLine.slice(maxLength);
        }
        currentChunk = remainingLine;
      } else {
        currentChunk = line;
      }
    } else {
      currentChunk += (currentChunk ? '\n' : '') + line;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

