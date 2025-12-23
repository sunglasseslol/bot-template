/**
 * Voice State Update Event Handler
 *
 * This event is fired when a user joins, leaves, or moves between voice channels.
 * Useful for voice channel tracking, statistics, and custom voice features.
 */

import { Events, VoiceState } from 'discord.js';
import { logger } from '../utils/logger';
import { Performance } from '../monitoring';

/**
 * Handles the voice state update event
 * @param oldState - The previous voice state
 * @param newState - The new voice state
 */
export async function handleVoiceStateUpdate(
  oldState: VoiceState,
  newState: VoiceState
): Promise<void> {
  try {
    // Ignore bot voice state changes
    if (newState.member?.user.bot || oldState.member?.user.bot) {
      return;
    }

    const user = newState.member?.user || oldState.member?.user;
    if (!user) return;

    // User joined a voice channel
    if (!oldState.channel && newState.channel) {
      logger.debug(`${user.tag} joined voice channel: ${newState.channel.name}`);
      // Here you can add logic like:
      // - Voice channel statistics
      // - Auto-role assignment
      // - Welcome messages
    }

    // User left a voice channel
    if (oldState.channel && !newState.channel) {
      logger.debug(`${user.tag} left voice channel: ${oldState.channel.name}`);
      // Here you can add logic like:
      // - Track voice time
      // - Remove temporary roles
    }

    // User moved between voice channels
    if (
      oldState.channel &&
      newState.channel &&
      oldState.channel.id !== newState.channel.id
    ) {
      logger.debug(
        `${user.tag} moved from ${oldState.channel.name} to ${newState.channel.name}`
      );
    }

    // User muted/unmuted
    if (oldState.mute !== newState.mute) {
      logger.debug(`${user.tag} ${newState.mute ? 'muted' : 'unmuted'}`);
    }

    // User deafened/undeafened
    if (oldState.deaf !== newState.deaf) {
      logger.debug(`${user.tag} ${newState.deaf ? 'deafened' : 'undeafened'}`);
    }
  } catch (error) {
    logger.error('Error handling voice state update event:', error);
  }
}

/**
 * Registers the voice state update event listener
 * @param client - The Discord client instance
 */
export function registerVoiceStateUpdateEvent(client: import('discord.js').Client): void {
  client.on(Events.VoiceStateUpdate, (oldState: VoiceState, newState: VoiceState) => {
    Performance.measure(
      () => handleVoiceStateUpdate(oldState, newState),
      'event_handler',
      'voice_state_update'
    ).catch((error) => {
      logger.error('Error in voice state update event handler:', error);
    });
  });
}

