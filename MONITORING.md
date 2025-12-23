# Monitoring & Event Handlers Documentation

This document explains the monitoring system, utility functions, and event handlers added to the bot template.

## 📊 Monitoring System

### Analytics

The `Analytics` class tracks command usage and guild events.

**Features:**

- Command usage tracking (prefix and slash)
- Success/failure tracking
- Execution time tracking
- Guild event logging (join/leave, member events)

**Usage:**

```typescript
import { Analytics } from './monitoring';

// Record command usage (automatically done by CommandManager)
await Analytics.recordCommandUsage({
  guildId: '123456789',
  userId: '987654321',
  command: 'ping',
  type: 'prefix',
  success: true,
  duration: 45,
});

// Get command statistics
const stats = await Analytics.getCommandStats('123456789', 7); // Last 7 days
const total = await Analytics.getTotalCommandCount('123456789');
const topCommands = await Analytics.getMostUsedCommands(10);
```

### Performance Monitoring

The `Performance` class tracks performance metrics for various operations.

**Features:**

- Execution time tracking
- Success/failure tracking
- Average performance calculation
- Slowest operations identification

**Usage:**

```typescript
import { Performance } from './monitoring';

// Measure function execution
const { result, duration } = await Performance.measure(
  async () => {
    // Your code here
    return someResult;
  },
  'command_execution',
  'my_command'
);

// Get average performance
const avg = await Performance.getAveragePerformance(
  'command_execution',
  'my_command',
  7 // days
);

// Get slowest operations
const slowest = await Performance.getSlowestMetrics('command_execution', 10);
```

## 🛠️ Utility Functions

### Time Utilities (`src/utils/time.ts`)

**Functions:**

- `formatDuration(ms, short?)` - Format milliseconds to human-readable duration
- `formatRelativeTime(date)` - Format date as relative time ("2 hours ago")
- `formatDiscordTimestamp(date, style?)` - Format date as Discord timestamp
- `parseDuration(duration)` - Parse duration string to milliseconds
- `formatDate(date)` - Format date to readable string

**Usage:**

```typescript
import { formatDuration, formatRelativeTime, formatDiscordTimestamp } from './utils/time';

formatDuration(3600000); // "1 hour"
formatDuration(3600000, true); // "1h"
formatRelativeTime(new Date()); // "just now"
formatDiscordTimestamp(new Date(), 'R'); // "<t:1234567890:R>"
```

### Validation Utilities (`src/utils/validation.ts`)

**Functions:**

- `isValidUserId(id)` - Validate Discord user ID
- `isValidChannelId(id)` - Validate Discord channel ID
- `isValidRoleId(id)` - Validate Discord role ID
- `isValidGuildId(id)` - Validate Discord guild ID
- `isValidUrl(url)` - Validate URL
- `isValidEmail(email)` - Validate email address
- `isInRange(value, min, max)` - Check if number is in range
- `isLengthInRange(str, min, max)` - Check if string length is in range
- `sanitizeString(input)` - Remove dangerous characters
- `extractUserId(input)` - Extract user ID from mention or plain ID
- `extractChannelId(input)` - Extract channel ID from mention
- `extractRoleId(input)` - Extract role ID from mention

**Usage:**

```typescript
import { isValidUserId, extractUserId, sanitizeString } from './utils/validation';

if (isValidUserId(userId)) {
  // Process user
}

const userId = extractUserId('<@123456789>'); // "123456789"
const safeInput = sanitizeString(userInput);
```

### Permission Utilities (`src/utils/permissions.ts`)

**Functions:**

- `hasPermission(member, permission)` - Check if member has permission
- `isAdministrator(member)` - Check if member is admin
- `isModerator(member)` - Check if member is moderator
- `hasRole(member, roleId)` - Check if member has role
- `hasAnyRole(member, roleIds)` - Check if member has any role
- `hasAllRoles(member, roleIds)` - Check if member has all roles
- `getHighestRole(member)` - Get member's highest role
- `compareRoles(member1, member2)` - Compare role positions
- `canModerate(member1, member2)` - Check if member1 can moderate member2

**Usage:**

```typescript
import { isAdministrator, canModerate, hasRole } from './utils/permissions';

if (isAdministrator(member)) {
  // Admin-only code
}

if (canModerate(moderator, target)) {
  // Can moderate
}

if (hasRole(member, '123456789')) {
  // Has role
}
```

### Formatting Utilities (`src/utils/formatting.ts`)

**Functions:**

- `truncate(str, maxLength, suffix?)` - Truncate string with ellipsis
- `escapeMarkdown(text)` - Escape Discord markdown
- `escapeCodeBlock(text)` - Escape code blocks
- `formatNumber(num)` - Format number with commas
- `formatPercentage(num, isDecimal?)` - Format as percentage
- `formatBytes(bytes, decimals?)` - Format bytes to human-readable size
- `capitalize(str)` - Capitalize first letter
- `toTitleCase(str)` - Convert to title case
- `codeBlock(code, language?)` - Wrap in code block
- `inlineCode(code)` - Wrap in inline code
- `createProgressBar(current, total, length?)` - Create progress bar
- `formatNumberedList(items, start?)` - Format as numbered list
- `formatBulletList(items, bullet?)` - Format as bullet list

**Usage:**

```typescript
import { truncate, formatNumber, createProgressBar, codeBlock } from './utils/formatting';

truncate('Very long text', 10); // "Very long..."
formatNumber(1234567); // "1,234,567"
createProgressBar(75, 100); // "████████████████░░░░ 75.0%"
codeBlock('const x = 1;', 'typescript');
```

## 🎯 Event Handlers

### Guild Events

#### `guildCreate`

- **Triggered:** When bot joins a server
- **Actions:**
  - Logs guild join
  - Records analytics event
  - Creates/updates guild in database

#### `guildDelete`

- **Triggered:** When bot leaves a server
- **Actions:**
  - Logs guild leave
  - Records analytics event

### Member Events

#### `guildMemberAdd`

- **Triggered:** When a member joins a server
- **Actions:**
  - Logs member join
  - Records analytics event
  - Creates/updates user in database
  - Sends welcome message (if enabled in config)

#### `guildMemberRemove`

- **Triggered:** When a member leaves a server
- **Actions:**
  - Logs member leave
  - Records analytics event

### Interaction Events

#### `messageReactionAdd`

- **Triggered:** When a user reacts to a message
- **Actions:**
  - Logs reaction (for debugging)
  - Can be extended for reaction roles, polls, etc.

#### `voiceStateUpdate`

- **Triggered:** When a user joins/leaves/moves voice channels
- **Actions:**
  - Logs voice state changes
  - Can be extended for voice tracking, statistics, etc.

## 📈 Database Schema

The monitoring system uses the following database models:

### CommandUsage

- Tracks every command execution
- Stores: guild, user, command name, type, args, success, error, duration

### GuildEvent

- Tracks guild and member events
- Stores: guild, event type, user, metadata

### PerformanceMetric

- Tracks performance metrics
- Stores: metric type, name, duration, success, metadata

## ⚙️ Configuration

Enable/disable monitoring features in `config.json`:

```json
{
  "features": {
    "enableAnalytics": true,
    "enableLogging": true
  }
}
```

## 📝 Example Usage

### Using Analytics in a Command

```typescript
import { Analytics } from '../monitoring';

export const statsCommand: Command = {
  name: 'stats',
  description: 'View command statistics',
  async execute(context) {
    const stats = await Analytics.getCommandStats(context.message?.guild?.id);
    // Display stats...
  },
};
```

### Using Performance Monitoring

```typescript
import { Performance } from '../monitoring';

async function expensiveOperation() {
  const { result, duration } = await Performance.measure(
    async () => {
      // Your expensive code
      return await someSlowOperation();
    },
    'database_query',
    'fetch_user_data'
  );

  return result;
}
```

### Using Utilities in Commands

```typescript
import { formatDuration, truncate } from '../utils/time';
import { isValidUserId, extractUserId } from '../utils/validation';
import { isAdministrator } from '../utils/permissions';
import { formatNumber, createProgressBar } from '../utils/formatting';

export const exampleCommand: Command = {
  name: 'example',
  async execute(context) {
    const { message, args } = context;
    if (!message) return;

    // Validate user ID
    const userId = extractUserId(args[0]);
    if (!userId || !isValidUserId(userId)) {
      await message.reply('Invalid user ID!');
      return;
    }

    // Check permissions
    if (!isAdministrator(message.member)) {
      await message.reply('You need admin permissions!');
      return;
    }

    // Format output
    const progress = createProgressBar(75, 100);
    const formatted = formatNumber(1234567);
    await message.reply(`Progress: ${progress}\nCount: ${formatted}`);
  },
};
```

## 🚀 Next Steps

1. **Run database migration:**

   ```bash
   npm run prisma:migrate
   ```

2. **Enable analytics in config.json:**

   ```json
   {
     "features": {
       "enableAnalytics": true
     }
   }
   ```

3. **Start using utilities in your commands!**

4. **Extend event handlers** with your custom logic (reaction roles, welcome messages, etc.)
