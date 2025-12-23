/**
 * Permissions Utility Module
 *
 * Provides utilities for checking Discord permissions and roles.
 * Useful for command permission validation and role management.
 */

import { GuildMember, PermissionResolvable, PermissionsBitField, Role } from 'discord.js';

/**
 * Checks if a member has a specific permission
 * @param member - Guild member to check
 * @param permission - Permission to check
 * @returns Whether the member has the permission
 */
export function hasPermission(
  member: GuildMember | null,
  permission: PermissionResolvable
): boolean {
  if (!member) return false;
  return member.permissions.has(permission);
}

/**
 * Checks if a member has administrator permissions
 * @param member - Guild member to check
 * @returns Whether the member is an administrator
 */
export function isAdministrator(member: GuildMember | null): boolean {
  return hasPermission(member, PermissionsBitField.Flags.Administrator);
}

/**
 * Checks if a member has moderation permissions
 * @param member - Guild member to check
 * @returns Whether the member has moderation permissions
 */
export function isModerator(member: GuildMember | null): boolean {
  if (!member) return false;
  return member.permissions.has([
    PermissionsBitField.Flags.BanMembers,
    PermissionsBitField.Flags.KickMembers,
    PermissionsBitField.Flags.ManageMessages,
  ]);
}

/**
 * Checks if a member has a specific role by ID
 * @param member - Guild member to check
 * @param roleId - Role ID to check
 * @returns Whether the member has the role
 */
export function hasRole(member: GuildMember | null, roleId: string): boolean {
  if (!member) return false;
  return member.roles.cache.has(roleId);
}

/**
 * Checks if a member has any of the specified roles
 * @param member - Guild member to check
 * @param roleIds - Array of role IDs to check
 * @returns Whether the member has any of the roles
 */
export function hasAnyRole(member: GuildMember | null, roleIds: string[]): boolean {
  if (!member || roleIds.length === 0) return false;
  return roleIds.some((roleId) => member.roles.cache.has(roleId));
}

/**
 * Checks if a member has all of the specified roles
 * @param member - Guild member to check
 * @param roleIds - Array of role IDs to check
 * @returns Whether the member has all of the roles
 */
export function hasAllRoles(member: GuildMember | null, roleIds: string[]): boolean {
  if (!member || roleIds.length === 0) return false;
  return roleIds.every((roleId) => member.roles.cache.has(roleId));
}

/**
 * Gets a member's highest role
 * @param member - Guild member
 * @returns Highest role or null
 */
export function getHighestRole(member: GuildMember | null): Role | null {
  if (!member) return null;
  return member.roles.highest;
}

/**
 * Compares two members' roles to see who is higher
 * @param member1 - First guild member
 * @param member2 - Second guild member
 * @returns Positive if member1 is higher, negative if member2 is higher, 0 if equal
 */
export function compareRoles(member1: GuildMember | null, member2: GuildMember | null): number {
  if (!member1 || !member2) return 0;
  const role1 = member1.roles.highest;
  const role2 = member2.roles.highest;
  return role1.comparePositionTo(role2);
}

/**
 * Checks if member1 can moderate member2
 * @param member1 - Moderator member
 * @param member2 - Target member
 * @returns Whether member1 can moderate member2
 */
export function canModerate(member1: GuildMember | null, member2: GuildMember | null): boolean {
  if (!member1 || !member2) return false;
  if (member1.id === member2.id) return false;
  if (member1.guild.ownerId === member2.id) return false;
  if (member1.guild.ownerId === member1.id) return true;
  return compareRoles(member1, member2) > 0;
}

/**
 * Gets all roles a member has as an array of IDs
 * @param member - Guild member
 * @returns Array of role IDs
 */
export function getRoleIds(member: GuildMember | null): string[] {
  if (!member) return [];
  return Array.from(member.roles.cache.keys());
}

/**
 * Checks if a member can perform an action based on required permissions
 * @param member - Guild member to check
 * @param requiredPermissions - Required permissions
 * @returns Whether the member has all required permissions
 */
export function hasRequiredPermissions(
  member: GuildMember | null,
  requiredPermissions: PermissionResolvable
): boolean {
  return hasPermission(member, requiredPermissions);
}
