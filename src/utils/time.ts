/**
 * Time Utility Module
 *
 * Provides utilities for formatting and manipulating time values.
 * Useful for displaying durations, timestamps, and relative times.
 */

/**
 * Formats a duration in milliseconds to a human-readable string
 * @param ms - Duration in milliseconds
 * @param short - Whether to use short format (e.g., "1d" vs "1 day")
 * @returns Formatted duration string
 */
export function formatDuration(ms: number, short = false): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (short) {
    if (years > 0) return `${years}y`;
    if (months > 0) return `${months}mo`;
    if (weeks > 0) return `${weeks}w`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  }

  const parts: string[] = [];

  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  if (weeks > 0) parts.push(`${weeks} ${weeks === 1 ? 'week' : 'weeks'}`);
  if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (seconds > 0 && parts.length === 0) {
    parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  }

  if (parts.length === 0) return '0 seconds';

  // Return up to 2 parts for readability
  return parts.slice(0, 2).join(', ');
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const absDiff = Math.abs(diff);

  if (absDiff < 1000) return 'just now';
  if (absDiff < 60000) return `${Math.floor(absDiff / 1000)} seconds ago`;
  if (absDiff < 3600000) return `${Math.floor(absDiff / 60000)} minutes ago`;
  if (absDiff < 86400000) return `${Math.floor(absDiff / 3600000)} hours ago`;
  if (absDiff < 604800000) return `${Math.floor(absDiff / 86400000)} days ago`;
  if (absDiff < 2592000000) return `${Math.floor(absDiff / 604800000)} weeks ago`;
  if (absDiff < 31536000000) return `${Math.floor(absDiff / 2592000000)} months ago`;
  return `${Math.floor(absDiff / 31536000000)} years ago`;
}

/**
 * Formats a date to Discord timestamp format
 * @param date - Date to format
 * @param style - Timestamp style (t, T, d, D, f, F, R)
 * @returns Discord timestamp string
 */
export function formatDiscordTimestamp(date: Date, style: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R' = 'f'): string {
  const timestamp = Math.floor(date.getTime() / 1000);
  return `<t:${timestamp}:${style}>`;
}

/**
 * Parses a duration string to milliseconds
 * Supports formats like: "1d 2h 30m", "2h", "30m", "1w 3d"
 * @param duration - Duration string
 * @returns Duration in milliseconds
 */
export function parseDuration(duration: string): number {
  const units: Record<string, number> = {
    y: 365 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
    years: 365 * 24 * 60 * 60 * 1000,
    mo: 30 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    hours: 60 * 60 * 1000,
    m: 60 * 1000,
    minute: 60 * 1000,
    minutes: 60 * 1000,
    s: 1000,
    second: 1000,
    seconds: 1000,
  };

  const regex = /(\d+)\s*([a-zA-Z]+)/g;
  let total = 0;
  let match;

  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (units[unit]) {
      total += value * units[unit];
    }
  }

  return total;
}

/**
 * Gets a human-readable date string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

