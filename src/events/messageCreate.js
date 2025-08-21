import { createLogger } from '../config/logger.js';
import { environment } from '../config/environment.js';
import GuildSettings from '../database/models/GuildSettings.js';
import UserProfile from '../database/models/UserProfile.js';
import { cacheService } from '../services/redis.js';

const logger = createLogger('MessageCreate');

/**
 * Modern message create event with ES6
 */
export default {
  name: 'messageCreate',
  once: false,

  async execute(message, _client) {
    try {
      // Ignore bots and system messages
      if (message.author.bot || message.system) return;

      // Handle DMs differently
      if (!message.guild) {
        return await this.handleDirectMessage(message, _client);
      }

      // Get or create guild settings
      const guildSettings = await this.getGuildSettings(message.guild);

      // Update guild activity
      await this.updateGuildActivity(guildSettings);

      // Process commands
      await this.processCommands(message, _client, guildSettings);

      // Process XP system
      if (guildSettings.features.levelSystem.enabled) {
        await this.processXPSystem(message, guildSettings);
      }

      // Auto-moderation
      if (guildSettings.features.moderation.autoMod) {
        await this.processAutoModeration(message, guildSettings);
      }
    } catch (error) {
      logger.error('Message create event error', {
        error: error.message,
        guild: message.guild?.id,
        user: message.author.id
      });
    }
  },

  /**
   * Handle direct messages
   */
  async handleDirectMessage(message, _client) {
    try {
      // Log DM for moderation purposes
      logger.info('DM received', {
        user: message.author.tag,
        userId: message.author.id,
        content: message.content.substring(0, 100)
      });

      // Simple DM response
      if (message.content.toLowerCase().includes('help')) {
        await message.reply({
          content: `Hello! I'm Menhera-Chan. You can use me in servers by typing \`${environment.DEFAULT_PREFIX}help\`.`
        });
      }
    } catch (error) {
      logger.error('DM handling error', { error: error.message });
    }
  },

  /**
   * Get or create guild settings
   */
  async getGuildSettings(guild) {
    try {
      // Try to get from cache first
      const cacheKey = `guild:${guild.id}`;
      let guildSettings = null;

      if (cacheService) {
        guildSettings = await cacheService.get(cacheKey);
      }

      if (!guildSettings) {
        guildSettings = await GuildSettings.findByGuildId(guild.id);

        if (!guildSettings) {
          guildSettings = await GuildSettings.createDefault(guild.id, guild.name);
          logger.info('Created default guild settings', { guild: guild.name });
        }

        // Cache for 5 minutes
        if (cacheService) {
          await cacheService.set(cacheKey, guildSettings, 300);
        }
      }

      return guildSettings;
    } catch (error) {
      logger.error('Failed to get guild settings', {
        guild: guild.id,
        error: error.message
      });

      // Return basic settings if database fails
      return {
        guildId: guild.id,
        prefix: environment.DEFAULT_PREFIX,
        features: {
          levelSystem: { enabled: true },
          moderation: { autoMod: false }
        }
      };
    }
  },

  /**
   * Update guild activity
   */
  async updateGuildActivity(guildSettings) {
    try {
      if (guildSettings && guildSettings.incrementMessages) {
        await guildSettings.incrementMessages();
      }
    } catch (error) {
      logger.debug('Failed to update guild activity', { error: error.message });
    }
  },

  /**
   * Process command messages
   */
  async processCommands(message, client, guildSettings) {
    const prefix = guildSettings.prefix || environment.DEFAULT_PREFIX;

    // Check if message starts with prefix
    if (!message.content.startsWith(prefix)) return;

    // Parse command and arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    // Execute command through command handler
    const executed = await client.commandHandler.executeCommand(message, commandName, args);

    if (executed && guildSettings && guildSettings.incrementCommands) {
      await guildSettings.incrementCommands();
    }
  },

  /**
   * Process XP system
   */
  async processXPSystem(message, guildSettings) {
    try {
      const cooldownKey = `xp:${message.author.id}:${message.guild.id}`;

      // Check cooldown
      if (cacheService) {
        const onCooldown = await cacheService.exists(cooldownKey);
        if (onCooldown) return;
      }

      // Calculate XP gain
      const baseXP = Math.floor(Math.random() * 15) + 15; // 15-30 XP
      const multiplier = guildSettings.features.levelSystem.multiplier || 1;
      const xpGain = Math.floor(baseXP * multiplier);

      // Get or create user profile
      let userProfile = await UserProfile.findByUserId(message.author.id);

      if (!userProfile) {
        userProfile = await UserProfile.createProfile(
          message.author.id,
          message.author.username,
          message.author.discriminator
        );
      }

      const oldLevel = userProfile.globalStats.level;
      await userProfile.addXP(xpGain);
      const newLevel = userProfile.globalStats.level;

      // Set cooldown
      const cooldown = guildSettings.features.levelSystem.cooldown || 60;
      if (cacheService) {
        await cacheService.set(cooldownKey, true, cooldown);
      }

      // Check for level up
      if (newLevel > oldLevel && guildSettings.features.levelSystem.announcements) {
        await this.handleLevelUp(message, userProfile, newLevel, guildSettings);
      }
    } catch (error) {
      logger.error('XP system error', {
        error: error.message,
        user: message.author.id,
        guild: message.guild.id
      });
    }
  },

  /**
   * Handle level up announcements
   */
  async handleLevelUp(message, userProfile, newLevel, guildSettings) {
    try {
      const channel = guildSettings.features.levelSystem.announcementChannel
        ? await message.guild.channels.fetch(guildSettings.features.levelSystem.announcementChannel)
        : message.channel;

      if (!channel) return;

      const levelUpMessages = [
        `🎉 **${userProfile.username}** just reached level **${newLevel}**! Keep it up!`,
        `⭐ Congratulations **${userProfile.username}**! You're now level **${newLevel}**!`,
        `🚀 **${userProfile.username}** leveled up to **${newLevel}**! Amazing progress!`,
        `🎊 Level **${newLevel}** achieved by **${userProfile.username}**! Well done!`
      ];

      const randomMessage = levelUpMessages[Math.floor(Math.random() * levelUpMessages.length)];

      await channel.send({
        content: randomMessage,
        allowedMentions: { users: [userProfile.userId] }
      });
    } catch (error) {
      logger.error('Level up announcement error', { error: error.message });
    }
  },

  /**
   * Process auto-moderation
   */
  async processAutoModeration(message, guildSettings) {
    try {
      const { autoMod } = guildSettings;

      // Anti-spam check
      if (autoMod.antiSpam?.enabled) {
        await this.checkAntiSpam(message, autoMod.antiSpam);
      }

      // Anti-invite check
      if (autoMod.antiInvite?.enabled) {
        await this.checkAntiInvite(message, autoMod.antiInvite);
      }

      // Bad words filter
      if (autoMod.badWords?.enabled) {
        await this.checkBadWords(message, autoMod.badWords);
      }
    } catch (error) {
      logger.error('Auto-moderation error', { error: error.message });
    }
  },

  /**
   * Anti-spam protection
   */
  async checkAntiSpam(message, antiSpamConfig) {
    if (!cacheService) return;

    const key = `spam:${message.author.id}:${message.guild.id}`;
    const count = await cacheService.incr(key, antiSpamConfig.timeWindow || 5);

    if (count > (antiSpamConfig.maxMessages || 5)) {
      try {
        await message.delete();

        // Apply punishment based on config
        if (antiSpamConfig.punishment === 'mute') {
          // Implement mute logic
        } else if (antiSpamConfig.punishment === 'kick') {
          await message.member.kick('Auto-moderation: Spam detected');
        } else if (antiSpamConfig.punishment === 'ban') {
          await message.member.ban({ reason: 'Auto-moderation: Spam detected' });
        }

        logger.moderate('auto-spam', { id: 'system' }, message.author, 'Spam detected', message.guild);
      } catch (error) {
        logger.error('Anti-spam action error', { error: error.message });
      }
    }
  },

  /**
   * Anti-invite protection
   */
  async checkAntiInvite(message, antiInviteConfig) {
    const inviteRegex = /(discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/[a-zA-Z0-9]+/gi;

    if (inviteRegex.test(message.content)) {
      try {
        if (antiInviteConfig.action === 'delete') {
          await message.delete();
        }

        logger.moderate('auto-invite', { id: 'system' }, message.author, 'Invite link detected', message.guild);
      } catch (error) {
        logger.error('Anti-invite action error', { error: error.message });
      }
    }
  },

  /**
   * Bad words filter
   */
  async checkBadWords(message, badWordsConfig) {
    const content = message.content.toLowerCase();

    for (const word of badWordsConfig.words || []) {
      if (content.includes(word.toLowerCase())) {
        try {
          if (badWordsConfig.action === 'delete') {
            await message.delete();
          }

          logger.moderate('auto-badword', { id: 'system' }, message.author, `Bad word: ${word}`, message.guild);
          break;
        } catch (error) {
          logger.error('Bad words action error', { error: error.message });
        }
      }
    }
  }
};
