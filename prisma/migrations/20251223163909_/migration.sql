-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guilds" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "command_usages" (
    "id" TEXT NOT NULL,
    "guildId" TEXT,
    "userId" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "args" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "command_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_events" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guild_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_metrics" (
    "id" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_discordId_key" ON "users"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "guilds_discordId_key" ON "guilds"("discordId");

-- CreateIndex
CREATE INDEX "command_usages_guildId_idx" ON "command_usages"("guildId");

-- CreateIndex
CREATE INDEX "command_usages_userId_idx" ON "command_usages"("userId");

-- CreateIndex
CREATE INDEX "command_usages_command_idx" ON "command_usages"("command");

-- CreateIndex
CREATE INDEX "command_usages_createdAt_idx" ON "command_usages"("createdAt");

-- CreateIndex
CREATE INDEX "guild_events_guildId_idx" ON "guild_events"("guildId");

-- CreateIndex
CREATE INDEX "guild_events_eventType_idx" ON "guild_events"("eventType");

-- CreateIndex
CREATE INDEX "guild_events_createdAt_idx" ON "guild_events"("createdAt");

-- CreateIndex
CREATE INDEX "performance_metrics_metricType_idx" ON "performance_metrics"("metricType");

-- CreateIndex
CREATE INDEX "performance_metrics_name_idx" ON "performance_metrics"("name");

-- CreateIndex
CREATE INDEX "performance_metrics_createdAt_idx" ON "performance_metrics"("createdAt");

-- AddForeignKey
ALTER TABLE "command_usages" ADD CONSTRAINT "command_usages_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_events" ADD CONSTRAINT "guild_events_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
