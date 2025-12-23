# Discord Bot Template

A modular, production-ready Discord bot template built with TypeScript, Discord.js, Prisma, and PostgreSQL.

## Features

- 🎯 **Modular Architecture** - Easy to extend with new commands and systems
- 📝 **TypeScript** - Full type safety and excellent IDE support
- 🗄️ **Database Integration** - Prisma ORM with PostgreSQL
- ⚡ **Easy Command System** - Simple command registration and management
- 🎨 **Slash Commands** - Built-in support for Discord slash commands
- 🔧 **Developer Experience** - Prettier, ESLint, and comprehensive comments
- 📊 **Logging System** - Built-in logger for debugging and monitoring

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (local or remote)
- Discord Bot Token and Client ID

## Getting Started

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DATABASE_URL=postgresql://user:password@localhost:5432/discord_bot?schema=public
BOT_PREFIX=!
NODE_ENV=development
```

### 3. Set Up Database

Generate Prisma client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

### 4. Build and Run

Development mode (with hot-reload):

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## Project Structure

```
bot-template/
├── src/
│   ├── commands/          # Command implementations
│   │   ├── CommandManager.ts  # Command registration and handling
│   │   ├── ping.ts       # Example ping command
│   │   ├── info.ts       # Example info command
│   │   └── index.ts      # Command exports
│   ├── events/           # Discord event handlers
│   │   ├── ready.ts      # Bot ready event
│   │   ├── messageCreate.ts  # Message event handler
│   │   ├── interactionCreate.ts  # Interaction event handler
│   │   └── index.ts      # Event registration
│   ├── types/            # TypeScript type definitions
│   │   └── command.ts    # Command interface
│   ├── utils/            # Utility modules
│   │   ├── database.ts   # Prisma client instance
│   │   └── logger.ts     # Logging utility
│   ├── config/           # Configuration management
│   │   └── index.ts      # Environment config
│   ├── Bot.ts            # Main bot class
│   └── index.ts          # Entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── .env.example          # Environment variables template
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Adding Commands

Adding a new command is simple! Follow these steps:

### 1. Create a Command File

Create a new file in `src/commands/` (e.g., `src/commands/example.ts`):

```typescript
import { SlashCommandBuilder } from 'discord.js';
import { Command, CommandContext } from '../types/command';

export const exampleCommand: Command = {
  name: 'example',
  aliases: ['ex'],
  description: 'An example command',
  usage: '!example [args]',
  category: 'utility',
  cooldown: 5,

  // Optional: Slash command definition
  slashCommand: new SlashCommandBuilder()
    .setName('example')
    .setDescription('An example command')
    .addStringOption((option) =>
      option.setName('input').setDescription('Input string').setRequired(false)
    ),

  // Prefix command handler
  async execute(context: CommandContext): Promise<void> {
    const { message, args } = context;
    if (!message) return;

    await message.reply(`You said: ${args.join(' ')}`);
  },

  // Slash command handler
  async slashExecute(interaction): Promise<void> {
    const input = interaction.options.getString('input');
    await interaction.reply(`You said: ${input || 'nothing'}`);
  },
};
```

### 2. Register the Command

Add your command to `src/commands/index.ts`:

```typescript
import { exampleCommand } from './example';

export const commands: Command[] = [
  pingCommand,
  infoCommand,
  exampleCommand, // Add your command here
];
```

That's it! Your command is now registered and ready to use.

## Command Features

Commands support many features out of the box:

- **Aliases** - Multiple names for the same command
- **Cooldowns** - Rate limiting per user
- **Permissions** - Admin-only commands
- **Guild Only** - Commands that only work in servers
- **Slash Commands** - Modern Discord slash command support
- **Prefix Commands** - Traditional text-based commands

## Database Usage

The bot uses Prisma ORM for database operations. Example usage:

```typescript
import { prisma } from '../utils/database';

// Create a user
const user = await prisma.user.create({
  data: {
    discordId: '123456789',
    username: 'ExampleUser',
  },
});

// Find a user
const foundUser = await prisma.user.findUnique({
  where: { discordId: '123456789' },
});

// Update a user
await prisma.user.update({
  where: { discordId: '123456789' },
  data: { username: 'NewUsername' },
});
```

See the [Prisma documentation](https://www.prisma.io/docs) for more examples.

## Scripts

- `npm run dev` - Start bot in development mode with hot-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start bot in production mode
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint
- `npm run type-check` - Type check without building

## Development Tips

1. **Hot Reload**: Use `npm run dev` for automatic restarts on file changes
2. **Database GUI**: Use `npm run prisma:studio` to visually browse your database
3. **Type Safety**: The codebase is fully typed - leverage TypeScript's IntelliSense
4. **Code Formatting**: Run `npm run format` before committing code
5. **Slash Commands**: For faster testing, register commands to a specific guild (see `src/events/ready.ts`)

## Extending the Bot

### Adding New Event Handlers

1. Create a new file in `src/events/`
2. Create a register function that takes `client` and `commandManager`
3. Add it to `src/events/index.ts`

### Adding New Utilities

Create new files in `src/utils/` and import them where needed.

### Modifying Database Schema

1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate` to create a migration
3. Run `npm run prisma:generate` to update the Prisma client

## License

MIT

## Contributing

Feel free to fork this template and customize it for your needs!
