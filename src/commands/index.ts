/**
 * Command Index
 *
 * This file exports all commands for easy importing.
 * To add a new command:
 * 1. Create a new file in the commands directory
 * 2. Export the command object
 * 3. Import and add it to the commands array below
 */

import { Command } from '../types/command';
import { infoCommand } from './info';
import { helpCommand } from './help';

/**
 * Array of all commands to be registered
 * Add new commands here to make them available
 */
export const commands: Command[] = [infoCommand, helpCommand];
