# Prisma Studio Differences

## Why Prisma Studio Might Look Different

### 1. **Table Name Mapping**
This project uses `@@map()` directives to rename database tables:

- **Model Name** → **Database Table Name**
- `User` → `users`
- `Guild` → `guilds`
- `CommandUsage` → `command_usages`
- `GuildEvent` → `guild_events`
- `PerformanceMetric` → `performance_metrics`

**In Prisma Studio:** You'll see the **database table names** (users, guilds, etc.), not the model names.

### 2. **Prisma Version**
This project uses **Prisma 5.7.1**. Different versions have different UIs:

- **Prisma 4.x:** Older UI, different layout
- **Prisma 5.x:** Newer UI with improved features
- **Prisma 6.x:** Latest features (if available)

### 3. **Database Provider**
This project uses **PostgreSQL**. Different databases show differently:

- **SQLite:** Simpler, file-based
- **PostgreSQL:** More complex, supports more features
- **MySQL:** Similar to PostgreSQL but some differences

### 4. **Schema Complexity**
This schema includes:
- **Relationships** (foreign keys)
- **Indexes** (for performance)
- **Cascade deletes**
- **Nullable fields**

These affect how data is displayed and edited in Prisma Studio.

## Common Differences You Might Notice

### Table Names
- **Other projects:** Might show `User`, `Guild` (model names)
- **This project:** Shows `users`, `guilds` (table names from `@@map()`)

### UI Layout
- **Prisma 4.x:** Different sidebar, older design
- **Prisma 5.x:** Modern UI, better navigation
- **This project:** Uses Prisma 5.7.1

### Features Available
- **Relationships:** This project has many relationships, which show as links in Studio
- **Indexes:** Not directly visible in Studio but affect performance
- **Cascade deletes:** Affect what happens when you delete records

## How to Use Prisma Studio in This Project

1. **Start Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```

2. **Access the UI:**
   - Opens at `http://localhost:5555`
   - Shows all tables: `users`, `guilds`, `command_usages`, `guild_events`, `performance_metrics`

3. **Navigate Relationships:**
   - Click on related records to navigate
   - `command_usages` → `guilds` (via guildId)
   - `guild_events` → `guilds` (via guildId)

4. **Edit Data:**
   - Click any table to view/edit records
   - Use the "+" button to add new records
   - Click records to edit them

## Troubleshooting

### If Prisma Studio doesn't start:
1. **Check database connection:**
   ```bash
   # Verify .env file has correct DATABASE_URL
   cat .env | grep DATABASE_URL
   ```

2. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

3. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

### If tables don't appear:
- Make sure migrations have been run
- Check that the database connection is working
- Verify the schema.prisma file is correct

### If you see different table names:
- This is expected! The `@@map()` directives rename tables
- Model names (User, Guild) ≠ Table names (users, guilds)

## Comparing with Other Projects

To see what's different:

1. **Check Prisma version:**
   ```bash
   npx prisma --version
   ```

2. **Check schema.prisma:**
   - Look for `@@map()` directives
   - Check database provider (postgresql, sqlite, mysql)
   - Compare model structures

3. **Check package.json:**
   - Compare Prisma versions
   - Check for different Prisma-related packages

## Quick Reference

| Feature | This Project | Other Projects |
|---------|-------------|----------------|
| Prisma Version | 5.7.1 | May vary |
| Database | PostgreSQL | May vary |
| Table Names | Mapped (users, guilds) | May use model names |
| Relationships | Yes (many) | May vary |
| Indexes | Yes | May vary |

