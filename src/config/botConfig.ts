/**
 * Bot Configuration Module
 *
 * This module loads and manages non-sensitive bot configuration
 * from config.json. Sensitive data (tokens, database URLs) should
 * remain in .env files.
 */

import fs from 'fs';
import path from 'path';
import { z } from 'zod';

/**
 * Schema for bot configuration file
 */
const botConfigSchema = z.object({
  bot: z.object({
    name: z.string(),
    version: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
    footer: z.string().optional(),
  }),
  features: z
    .object({
      enableWelcomeMessages: z.boolean().optional(),
      enableLogging: z.boolean().optional(),
      enableAnalytics: z.boolean().optional(),
      enableCommandCooldowns: z.boolean().optional(),
      enableErrorReporting: z.boolean().optional(),
    })
    .optional(),
  defaults: z
    .object({
      prefix: z.string().optional(),
      language: z.string().optional(),
      timezone: z.string().optional(),
    })
    .optional(),
  limits: z
    .object({
      maxCooldown: z.number().optional(),
      maxMessageLength: z.number().optional(),
      maxEmbedFields: z.number().optional(),
    })
    .optional(),
  channels: z
    .object({
      logChannel: z.string().nullable().optional(),
      errorChannel: z.string().nullable().optional(),
      welcomeChannel: z.string().nullable().optional(),
    })
    .optional(),
  embeds: z
    .object({
      defaultColor: z.string().optional(),
      errorColor: z.string().optional(),
      successColor: z.string().optional(),
      warningColor: z.string().optional(),
    })
    .optional(),
  permissions: z
    .object({
      defaultAdminRoles: z.array(z.string()).optional(),
      defaultModRoles: z.array(z.string()).optional(),
    })
    .optional(),
});

export type BotConfig = z.infer<typeof botConfigSchema>;

/**
 * Loads bot configuration from config.json
 * @returns Bot configuration object
 */
function loadBotConfig(): BotConfig {
  const configPath = path.join(process.cwd(), 'config.json');

  try {
    // Check if config.json exists
    if (!fs.existsSync(configPath)) {
      // Return default configuration if file doesn't exist
      return {
        bot: {
          name: 'Discord Bot',
        },
      };
    }

    // Read and parse config file
    const configFile = fs.readFileSync(configPath, 'utf-8');
    const configData = JSON.parse(configFile);

    // Validate and return configuration
    return botConfigSchema.parse(configData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid configuration file: ${error.errors.map((e) => e.path.join('.')).join(', ')}`);
    }
    throw new Error(`Failed to load configuration: ${error}`);
  }
}

/**
 * Bot configuration object
 * Contains non-sensitive bot settings
 */
export const botConfig = loadBotConfig();

/**
 * Helper function to get embed color by type
 * @param type - Type of embed (default, error, success, warning)
 * @returns Hex color string
 */
export function getEmbedColor(type: 'default' | 'error' | 'success' | 'warning' = 'default'): number {
  const colors = botConfig.embeds || {};
  const colorMap: Record<string, string> = {
    default: colors.defaultColor || '#5865F2',
    error: colors.errorColor || '#ED4245',
    success: colors.successColor || '#57F287',
    warning: colors.warningColor || '#FEE75C',
  };

  // Convert hex to number (remove # and parse as hex)
  const hex = colorMap[type].replace('#', '');
  return parseInt(hex, 16);
}

/**
 * Check if a feature is enabled
 * @param feature - Feature name
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(feature: keyof NonNullable<BotConfig['features']>): boolean {
  return botConfig.features?.[feature] ?? false;
}

