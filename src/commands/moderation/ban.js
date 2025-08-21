import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { createLogger } from '../../config/logger.js';
import GuildSettings from '../../database/models/GuildSettings.js';
import UserProfile from '../../database/models/UserProfile.js';

const logger = createLogger('BanCommand');

/**
 * Modern ES6 Ban Command
 */
export default {
  name: 'ban',
  description: 'Ban a member from the server',
  category: 'moderation',
  usage: 'ban <user> [reason]',
  examples: [
    'ban @user Spamming',
    'ban 123456789012345678 Breaking rules'
  ],

  permissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  args: true,
  dmAllowed: false,
  cooldown: 5,

  async execute(message, args, _client) {
    try {
      // Parse target user
      const target = await this.parseTarget(message, args[0]);
      if (!target) {
        return await message.reply({
          content: '❌ User not found. Please mention a user or provide a valid user ID.'
        });
      }

      // Validation checks
      const validation = await this.validateBan(message, target);
      if (!validation.valid) {
        return await message.reply({ content: validation.error });
      }

      // Parse reason
      const reason = args.slice(1).join(' ') || 'No reason provided';

      // Get guild settings
      const guildSettings = await GuildSettings.findByGuildId(message.guild.id);

      // Create ban embed
      const banEmbed = this.createBanEmbed(target, message.author, reason, message.guild);

      // Send DM to user before banning
      await this.sendDMNotification(target, banEmbed, message.guild);

      // Execute ban
      await message.guild.members.ban(target.id, {
        reason: `${reason} | Banned by ${message.author.tag}`,
        deleteMessageDays: 1
      });

      // Send confirmation
      const confirmEmbed = this.createConfirmationEmbed(target, message.author, reason);
      await message.reply({ embeds: [confirmEmbed] });

      // Log moderation action
      await this.logModerationAction(message, target, reason, guildSettings);

      // Update user profile
      await this.updateUserProfile(target.id);

      logger.moderate('ban', message.author, target, reason, message.guild);
    } catch (error) {
      logger.error('Ban command error', {
        error: error.message,
        guild: message.guild.id,
        user: message.author.id
      });

      await message.reply({
        content: '❌ An error occurred while trying to ban the user.'
      });
    }
  },

  /**
   * Parse target user from mention or ID
   */
  async parseTarget(message, input) {
    if (!input) return null;

    try {
      // Try to get from mentions first
      const mentioned = message.mentions.users.first();
      if (mentioned) return mentioned;

      // Try to parse as ID
      const userId = input.replace(/[<@!>]/g, '');
      if (!/^\d{17,19}$/.test(userId)) return null;

      // Fetch user from Discord
      return await message.client.users.fetch(userId);
    } catch (error) {
      logger.debug('Failed to parse target user', { input, error: error.message });
      return null;
    }
  },

  /**
   * Validate ban operation
   */
  async validateBan(message, target) {
    // Check if target is bot
    if (target.bot) {
      return { valid: false, error: '❌ Cannot ban bots.' };
    }

    // Check if target is self
    if (target.id === message.author.id) {
      return { valid: false, error: '❌ You cannot ban yourself.' };
    }

    // Check if target is bot owner
    if (target.id === message.client.application.owner?.id) {
      return { valid: false, error: '❌ Cannot ban the bot owner.' };
    }

    // Check if user is in guild
    const member = await message.guild.members.fetch(target.id).catch(() => null);

    if (member) {
      // Check if target is server owner
      if (member.id === message.guild.ownerId) {
        return { valid: false, error: '❌ Cannot ban the server owner.' };
      }

      // Check role hierarchy
      if (member.roles.highest.position >= message.member.roles.highest.position) {
        return { valid: false, error: '❌ You cannot ban someone with equal or higher roles.' };
      }

      // Check if bot can ban the member
      if (!member.bannable) {
        return { valid: false, error: '❌ I cannot ban this user. They may have higher roles than me.' };
      }
    }

    // Check if already banned
    try {
      await message.guild.bans.fetch(target.id);
      return { valid: false, error: '❌ This user is already banned.' };
    } catch {
      // User is not banned, continue
    }

    return { valid: true };
  },

  /**
   * Create ban notification embed
   */
  createBanEmbed(target, moderator, reason, guild) {
    return new EmbedBuilder()
      .setTitle('🔨 You have been banned')
      .setColor(0xff0000)
      .setDescription(`You have been banned from **${guild.name}**`)
      .addFields(
        { name: 'Reason', value: reason, inline: false },
        { name: 'Moderator', value: moderator.tag, inline: true },
        { name: 'Date', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
      )
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: 'If you believe this ban was unjustified, you can appeal by contacting the server moderators.',
        iconURL: guild.iconURL({ dynamic: true })
      })
      .setTimestamp();
  },

  /**
   * Create confirmation embed
   */
  createConfirmationEmbed(target, moderator, reason) {
    return new EmbedBuilder()
      .setTitle('🔨 Member Banned')
      .setColor(0xff0000)
      .setDescription(`**${target.tag}** has been banned from the server`)
      .addFields(
        { name: 'User', value: `${target.tag}\n\`${target.id}\``, inline: true },
        { name: 'Moderator', value: moderator.tag, inline: true },
        { name: 'Reason', value: reason, inline: false }
      )
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
  },

  /**
   * Send DM notification to user
   */
  async sendDMNotification(target, embed, guild) {
    try {
      await target.send({ embeds: [embed] });
      logger.debug('Ban notification sent to user', {
        user: target.tag,
        guild: guild.name
      });
    } catch (error) {
      logger.debug('Failed to send ban notification DM', {
        user: target.tag,
        error: error.message
      });
    }
  },

  /**
   * Log moderation action
   */
  async logModerationAction(message, target, reason, guildSettings) {
    if (!guildSettings?.channels?.modLog) return;

    try {
      const logChannel = await message.guild.channels.fetch(guildSettings.channels.modLog);
      if (!logChannel) return;

      const logEmbed = new EmbedBuilder()
        .setTitle('🔨 Member Banned')
        .setColor(0xff0000)
        .addFields(
          { name: 'User', value: `${target.tag}\n\`${target.id}\``, inline: true },
          { name: 'Moderator', value: `${message.author.tag}\n\`${message.author.id}\``, inline: true },
          { name: 'Channel', value: message.channel.toString(), inline: true },
          { name: 'Reason', value: reason, inline: false },
          { name: 'Case ID', value: `#${Date.now().toString(36)}`, inline: true }
        )
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      await logChannel.send({ embeds: [logEmbed] });

      // Update guild stats
      if (guildSettings) {
        guildSettings.stats.moderationActions++;
        await guildSettings.save();
      }
    } catch (error) {
      logger.error('Failed to log moderation action', {
        error: error.message,
        guild: message.guild.id
      });
    }
  },

  /**
   * Update user profile moderation stats
   */
  async updateUserProfile(userId) {
    try {
      let userProfile = await UserProfile.findByUserId(userId);

      if (!userProfile) {
        // Create basic profile for moderation tracking
        userProfile = new UserProfile({
          userId,
          username: 'Unknown',
          discriminator: '0000',
          createdBy: 'system'
        });
      }

      userProfile.moderation.totalBans++;
      userProfile.moderation.reputation = Math.max(0, userProfile.moderation.reputation - 20);

      if (userProfile.moderation.reputation < 30) {
        userProfile.moderation.trustLevel = 'untrusted';
      }

      await userProfile.save();
    } catch (error) {
      logger.error('Failed to update user profile', {
        userId,
        error: error.message
      });
    }
  }
};
