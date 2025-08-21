import mongoose from 'mongoose';
import { createBaseSchema, validators, createIndexes } from '../connection.js';

/**
 * Guild Settings Schema
 */
const guildSettingsSchema = createBaseSchema({
  // Guild identification
  guildId: {
    type: String,
    required: true,
    unique: true,
    validate: validators.discordId,
    index: true
  },

  guildName: {
    type: String,
    required: true,
    maxlength: 100
  },

  // Bot configuration
  prefix: {
    type: String,
    default: '!',
    maxlength: 5,
    validate: {
      validator: (v) => v && v.trim().length > 0,
      message: 'Prefix cannot be empty'
    }
  },

  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'ja', 'ko']
  },

  timezone: {
    type: String,
    default: 'UTC',
    validate: {
      validator: (v) => {
        try {
          Intl.DateTimeFormat(undefined, { timeZone: v });
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid timezone'
    }
  },

  // Channel configurations
  channels: {
    welcome: {
      type: String,
      validate: validators.discordChannel,
      default: null
    },

    farewell: {
      type: String,
      validate: validators.discordChannel,
      default: null
    },

    modLog: {
      type: String,
      validate: validators.discordChannel,
      default: null
    },

    memberLog: {
      type: String,
      validate: validators.discordChannel,
      default: null
    },

    messageLog: {
      type: String,
      validate: validators.discordChannel,
      default: null
    },

    inviteLog: {
      type: String,
      validate: validators.discordChannel,
      default: null
    },

    starboard: {
      type: String,
      validate: validators.discordChannel,
      default: null
    },

    suggestions: {
      type: String,
      validate: validators.discordChannel,
      default: null
    },

    reports: {
      type: String,
      validate: validators.discordChannel,
      default: null
    }
  },

  // Role configurations
  roles: {
    muted: {
      type: String,
      validate: validators.discordChannel,
      default: null
    },

    autoroles: [{
      type: String,
      validate: validators.discordChannel
    }],

    moderator: [{
      type: String,
      validate: validators.discordChannel
    }],

    admin: [{
      type: String,
      validate: validators.discordChannel
    }]
  },

  // Feature toggles
  features: {
    welcomeMessage: {
      enabled: { type: Boolean, default: true },
      message: { type: String, maxlength: 2000 },
      embed: { type: Boolean, default: true },
      dm: { type: Boolean, default: false }
    },

    farewellMessage: {
      enabled: { type: Boolean, default: false },
      message: { type: String, maxlength: 2000 },
      embed: { type: Boolean, default: true }
    },

    levelSystem: {
      enabled: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true },
      announcementChannel: {
        type: String,
        validate: validators.discordChannel,
        default: null
      },
      multiplier: { type: Number, default: 1, min: 0.1, max: 10 },
      cooldown: { type: Number, default: 60, min: 1, max: 300 }
    },

    moderation: {
      enabled: { type: Boolean, default: true },
      autoMod: { type: Boolean, default: false },
      antiSpam: { type: Boolean, default: false },
      antiRaid: { type: Boolean, default: false },
      muteRole: {
        type: String,
        validate: validators.discordChannel,
        default: null
      }
    },

    music: {
      enabled: { type: Boolean, default: true },
      maxQueueSize: { type: Number, default: 100, min: 1, max: 1000 },
      defaultVolume: { type: Number, default: 50, min: 1, max: 100 },
      djRole: {
        type: String,
        validate: validators.discordChannel,
        default: null
      }
    },

    economy: {
      enabled: { type: Boolean, default: false },
      dailyAmount: { type: Number, default: 100, min: 1 },
      workCooldown: { type: Number, default: 3600, min: 60 },
      currency: { type: String, default: '💰', maxlength: 10 }
    }
  },

  // Starboard configuration
  starboard: {
    enabled: { type: Boolean, default: false },
    threshold: { type: Number, default: 3, min: 1, max: 50 },
    emoji: { type: String, default: '⭐', maxlength: 10 },
    selfStar: { type: Boolean, default: false },
    channel: {
      type: String,
      validate: validators.discordChannel,
      default: null
    }
  },

  // Auto-moderation settings
  autoMod: {
    enabled: { type: Boolean, default: false },

    antiSpam: {
      enabled: { type: Boolean, default: false },
      maxMessages: { type: Number, default: 5, min: 2, max: 20 },
      timeWindow: { type: Number, default: 5, min: 1, max: 60 },
      punishment: {
        type: String,
        enum: ['warn', 'mute', 'kick', 'ban'],
        default: 'mute'
      },
      duration: { type: Number, default: 600, min: 60 }
    },

    antiInvite: {
      enabled: { type: Boolean, default: false },
      action: {
        type: String,
        enum: ['delete', 'warn', 'mute'],
        default: 'delete'
      },
      whitelist: [String]
    },

    badWords: {
      enabled: { type: Boolean, default: false },
      words: [String],
      action: {
        type: String,
        enum: ['delete', 'warn', 'mute'],
        default: 'delete'
      },
      bypass: [String]
    }
  },

  // Premium features
  premium: {
    enabled: { type: Boolean, default: false },
    tier: { type: Number, default: 0, min: 0, max: 3 },
    expires: { type: Date, default: null },
    features: [String]
  },

  // Statistics
  stats: {
    commandsUsed: { type: Number, default: 0 },
    messagesProcessed: { type: Number, default: 0 },
    moderationActions: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  }
});

// Indexes for performance
const guildIndexes = [
  { fields: { guildId: 1 }, options: { unique: true } },
  { fields: { 'features.levelSystem.enabled': 1 } },
  { fields: { 'features.moderation.enabled': 1 } },
  { fields: { 'premium.enabled': 1 } },
  { fields: { isActive: 1 } },
  { fields: { createdAt: -1 } }
];

// Pre-save middleware
guildSettingsSchema.pre('save', function(next) {
  if (this.isNew) {
    this.stats.lastActivity = new Date();
  }

  // Ensure required channels exist when features are enabled
  if (this.features.welcomeMessage.enabled && !this.channels.welcome) {
    this.features.welcomeMessage.enabled = false;
  }

  if (this.features.moderation.enabled && !this.channels.modLog) {
    this.features.moderation.enabled = false;
  }

  next();
});

// Instance methods
guildSettingsSchema.methods.updateActivity = function() {
  this.stats.lastActivity = new Date();
  return this.save();
};

guildSettingsSchema.methods.incrementCommands = function() {
  this.stats.commandsUsed++;
  this.stats.lastActivity = new Date();
  return this.save();
};

guildSettingsSchema.methods.incrementMessages = function() {
  this.stats.messagesProcessed++;
  this.stats.lastActivity = new Date();
  return this.save();
};

// Static methods
guildSettingsSchema.statics.findByGuildId = function(guildId) {
  return this.findOne({ guildId, isActive: true });
};

guildSettingsSchema.statics.createDefault = function(guildId, guildName) {
  return this.create({
    guildId,
    guildName,
    createdBy: 'system'
  });
};

const GuildSettings = mongoose.model('GuildSettings', guildSettingsSchema);

// Create indexes
createIndexes(GuildSettings, guildIndexes).catch(console.error);

export default GuildSettings;
