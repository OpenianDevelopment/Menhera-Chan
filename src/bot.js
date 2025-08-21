import { Client, Collection, GatewayIntentBits, Partials, ActivityType } from 'discord.js';
import { environment, validateEnvironment } from './config/environment.js';
import { createLogger } from './config/logger.js';
import { initializeDatabase } from './database/connection.js';
import { initializeRedis } from './services/redis.js';
import CommandHandler from './utils/CommandHandler.js';
import EventHandler from './utils/EventHandler.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-unused-vars
const __dirname = dirname(__filename);

// Initialize logger
const logger = createLogger('Bot');

/**
 * Modern Discord.js v14 Bot with ES6 Modules
 */
class MenheraChanBot {
  constructor() {
    // Validate environment variables
    validateEnvironment();

    // Initialize Discord client with modern intents
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildPresences
      ],
      partials: [
        Partials.Message,
        Partials.Reaction,
        Partials.Channel,
        Partials.User,
        Partials.GuildMember
      ],
      allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: false
      }
    });

    // Initialize handlers
    this.commandHandler = new CommandHandler(this.client);
    this.eventHandler = new EventHandler(this.client);

    // Bot collections
    this.client.commands = new Collection();
    this.client.cooldowns = new Collection();
    this.client.musicPlayers = new Collection();

    // Bot properties
    this.client.config = environment;
    this.client.logger = logger;
    this.client.commandHandler = this.commandHandler;

    // Set bot owner
    this.client.ownerId = environment.OWNER_IDS[0] || null;

    // Setup error handlers
    this.setupErrorHandlers();
  }

  /**
   * Initialize the bot
   */
  async initialize() {
    try {
      logger.info('🚀 Starting Menhera-Chan Bot v2.0...');

      // Initialize database
      logger.info('📊 Connecting to database...');
      await initializeDatabase();

      // Initialize Redis (optional)
      if (environment.REDIS_URL) {
        try {
          logger.info('🔴 Connecting to Redis...');
          await initializeRedis();

          // Initialize cache services after Redis connection
          const { cacheService, rateLimitService } = await import('./services/redis.js');
          cacheService.initialize();
          rateLimitService.initialize();

          logger.info('✅ Redis connected and cache services initialized');
        } catch (error) {
          logger.warn('Redis connection failed, continuing without caching', {
            error: error.message
          });
        }
      }

      // Load commands
      logger.info('⚡ Loading commands...');
      const commandStats = await this.commandHandler.loadCommands();
      logger.info(`📋 Loaded ${commandStats.commands} commands across ${commandStats.categories} categories`);

      // Load events
      logger.info('🎯 Loading events...');
      const eventStats = await this.eventHandler.loadEvents();
      logger.info(`🎪 Loaded ${eventStats.events} events`);

      // Login to Discord
      logger.info('🔐 Logging in to Discord...');
      await this.client.login(environment.DISCORD_TOKEN);

      logger.info('✅ Bot initialization completed successfully');
    } catch (error) {
      logger.error('❌ Bot initialization failed', { error: error.message });
      process.exit(1);
    }
  }

  /**
   * Setup error handlers
   */
  setupErrorHandlers() {
    // Client error handlers
    this.client.on('error', (error) => {
      logger.error('Discord client error', { error: error.message });
    });

    this.client.on('warn', (warning) => {
      logger.warn('Discord client warning', { warning });
    });

    // Process error handlers
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', {
        reason: reason?.message || reason,
        promise: promise.toString()
      });
    });

    process.on('warning', (warning) => {
      logger.warn('Process warning', {
        name: warning.name,
        message: warning.message,
        stack: warning.stack
      });
    });

    // Graceful shutdown
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
  }

  /**
   * Graceful shutdown
   */
  async shutdown(signal) {
    logger.info(`🛑 Received ${signal}, shutting down gracefully...`);

    try {
      // Set bot status to offline
      await this.client.user?.setStatus('invisible');

      // Destroy Discord client
      this.client.destroy();

      // Close database connection
      if (this.client.db) {
        await this.client.db.close();
      }

      logger.info('✅ Shutdown completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown', { error: error.message });
      process.exit(1);
    }
  }

  /**
   * Start the bot
   */
  async start() {
    await this.initialize();
  }
}

// Bot ready event
const bot = new MenheraChanBot();

bot.client.once('ready', async () => {
  logger.info(`🎉 ${bot.client.user.tag} is online!`);
  logger.info(`📊 Serving ${bot.client.guilds.cache.size} guilds with ${bot.client.users.cache.size} users`);

  // Set bot activity
  const activities = [
    { name: `${environment.DEFAULT_PREFIX}help | Menhera-Chan v2.0`, type: ActivityType.Playing },
    { name: `${bot.client.guilds.cache.size} servers`, type: ActivityType.Watching },
    { name: `${bot.client.users.cache.size} users`, type: ActivityType.Listening },
    { name: 'your commands', type: ActivityType.Listening }
  ];

  let activityIndex = 0;

  const updateActivity = () => {
    const activity = activities[activityIndex];
    bot.client.user.setActivity(activity.name, { type: activity.type });
    activityIndex = (activityIndex + 1) % activities.length;
  };

  // Update activity immediately and then every 30 seconds
  updateActivity();
  setInterval(updateActivity, 30000);

  logger.info('🎮 Bot activity rotation started');
});

// Start the bot
bot.start().catch((error) => {
  logger.error('❌ Failed to start bot', { error: error.message });
  process.exit(1);
});

export default bot;
