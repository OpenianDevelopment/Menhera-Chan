import mongoose from 'mongoose';
import { createBaseSchema, validators, createIndexes } from '../connection.js';

/**
 * User Profile Schema
 */
const userProfileSchema = createBaseSchema({
  // User identification
  userId: {
    type: String,
    required: true,
    unique: true,
    validate: validators.discordId,
    index: true
  },

  username: {
    type: String,
    required: true,
    maxlength: 100
  },

  discriminator: {
    type: String,
    required: true,
    maxlength: 4
  },

  // Global user statistics
  globalStats: {
    commandsUsed: { type: Number, default: 0 },
    guildsJoined: { type: Number, default: 0 },
    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    prestige: { type: Number, default: 0 }
  },

  // Economy
  economy: {
    wallet: { type: Number, default: 0, min: 0 },
    bank: { type: Number, default: 0, min: 0 },
    netWorth: { type: Number, default: 0 },

    dailyStreak: { type: Number, default: 0 },
    lastDaily: { type: Date, default: null },
    lastWork: { type: Date, default: null },
    lastRob: { type: Date, default: null },

    inventory: [{
      itemId: String,
      quantity: { type: Number, default: 1, min: 0 },
      acquiredAt: { type: Date, default: Date.now }
    }],

    transactions: [{
      type: {
        type: String,
        enum: ['daily', 'work', 'rob', 'gamble', 'shop', 'trade', 'admin'],
        required: true
      },
      amount: { type: Number, required: true },
      description: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },

  // Achievements and badges
  achievements: [{
    id: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }
  }],

  badges: [{
    id: { type: String, required: true },
    name: String,
    description: String,
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    earnedAt: { type: Date, default: Date.now }
  }],

  // Profile customization
  profile: {
    bio: { type: String, maxlength: 500 },
    color: {
      type: String,
      validate: validators.color,
      default: '#7289da'
    },
    banner: String,
    favoriteCommand: String,
    timezone: { type: String, default: 'UTC' },

    privacy: {
      showStats: { type: Boolean, default: true },
      showEconomy: { type: Boolean, default: true },
      showAchievements: { type: Boolean, default: true },
      allowDMs: { type: Boolean, default: true }
    }
  },

  // Preferences
  preferences: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'ja', 'ko']
    },

    notifications: {
      levelUp: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      dailyReminder: { type: Boolean, default: false },
      economyUpdates: { type: Boolean, default: true }
    },

    music: {
      defaultVolume: { type: Number, default: 50, min: 1, max: 100 },
      autoplay: { type: Boolean, default: false },
      showNowPlaying: { type: Boolean, default: true }
    }
  },

  // Marriage/relationship system
  relationships: {
    partner: {
      userId: {
        type: String,
        validate: validators.discordId,
        default: null
      },
      since: { type: Date, default: null },
      anniversary: { type: Date, default: null }
    },

    friends: [{
      userId: {
        type: String,
        validate: validators.discordId,
        required: true
      },
      since: { type: Date, default: Date.now },
      nickname: String
    }]
  },

  // Premium subscription
  premium: {
    active: { type: Boolean, default: false },
    tier: { type: Number, default: 0, min: 0, max: 3 },
    expires: { type: Date, default: null },
    totalMonths: { type: Number, default: 0 },
    benefits: [String]
  },

  // Moderation history
  moderation: {
    totalWarnings: { type: Number, default: 0 },
    totalMutes: { type: Number, default: 0 },
    totalBans: { type: Number, default: 0 },

    reputation: { type: Number, default: 100, min: 0, max: 100 },
    trustLevel: {
      type: String,
      enum: ['untrusted', 'neutral', 'trusted', 'verified'],
      default: 'neutral'
    }
  },

  // Activity tracking
  activity: {
    lastSeen: { type: Date, default: Date.now },
    lastCommand: { type: Date, default: null },
    commandsToday: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 }
  },

  // API integrations
  connections: {
    mal: {
      connected: { type: Boolean, default: false },
      username: String,
      lastSync: { type: Date, default: null }
    },

    spotify: {
      connected: { type: Boolean, default: false },
      username: String,
      lastSync: { type: Date, default: null }
    },

    steam: {
      connected: { type: Boolean, default: false },
      steamId: String,
      lastSync: { type: Date, default: null }
    }
  }
});

// Virtual for full tag
userProfileSchema.virtual('tag').get(function() {
  return `${this.username}#${this.discriminator}`;
});

// Virtual for next level XP requirement
userProfileSchema.virtual('nextLevelXP').get(function() {
  return Math.floor(100 * Math.pow(1.2, this.globalStats.level));
});

// Indexes
const userIndexes = [
  { fields: { userId: 1 }, options: { unique: true } },
  { fields: { 'globalStats.level': -1 } },
  { fields: { 'globalStats.totalXP': -1 } },
  { fields: { 'economy.netWorth': -1 } },
  { fields: { 'premium.active': 1 } },
  { fields: { 'activity.lastSeen': -1 } },
  { fields: { isActive: 1 } }
];

// Pre-save middleware
userProfileSchema.pre('save', function(next) {
  // Calculate net worth
  this.economy.netWorth = this.economy.wallet + this.economy.bank;

  // Update level based on XP
  const newLevel = Math.floor(Math.pow(this.globalStats.totalXP / 100, 1 / 1.2));
  if (newLevel > this.globalStats.level) {
    this.globalStats.level = newLevel;
  }

  // Reset daily command counter if it's a new day
  const today = new Date().toDateString();
  const lastCommandDate = this.activity.lastCommand?.toDateString();

  if (lastCommandDate !== today) {
    this.activity.commandsToday = 0;
  }

  next();
});

// Instance methods
userProfileSchema.methods.addXP = function(amount) {
  this.globalStats.totalXP += amount;
  this.activity.lastSeen = new Date();
  return this.save();
};

userProfileSchema.methods.addMoney = function(amount, type = 'wallet') {
  if (type === 'wallet') {
    this.economy.wallet += amount;
  } else if (type === 'bank') {
    this.economy.bank += amount;
  }

  this.economy.transactions.push({
    type: 'admin',
    amount,
    description: `Added ${amount} to ${type}`
  });

  return this.save();
};

userProfileSchema.methods.canUseDaily = function() {
  if (!this.economy.lastDaily) return true;

  const now = new Date();
  const lastDaily = new Date(this.economy.lastDaily);
  const timeDiff = now - lastDaily;

  return timeDiff >= 24 * 60 * 60 * 1000; // 24 hours
};

userProfileSchema.methods.useDaily = function(amount = 100) {
  if (!this.canUseDaily()) {
    throw new Error('Daily already claimed today');
  }

  this.economy.wallet += amount;
  this.economy.lastDaily = new Date();

  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (this.economy.lastDaily &&
      this.economy.lastDaily.toDateString() === yesterday.toDateString()) {
    this.economy.dailyStreak++;
  } else {
    this.economy.dailyStreak = 1;
  }

  this.economy.transactions.push({
    type: 'daily',
    amount,
    description: `Daily reward (streak: ${this.economy.dailyStreak})`
  });

  return this.save();
};

// Static methods
userProfileSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId, isActive: true });
};

userProfileSchema.statics.createProfile = function(userId, username, discriminator) {
  return this.create({
    userId,
    username,
    discriminator,
    createdBy: 'system'
  });
};

userProfileSchema.statics.getLeaderboard = function(type = 'level', limit = 10) {
  const sortField = {
    level: { 'globalStats.level': -1, 'globalStats.totalXP': -1 },
    xp: { 'globalStats.totalXP': -1 },
    money: { 'economy.netWorth': -1 },
    commands: { 'globalStats.commandsUsed': -1 }
  };

  return this.find({ isActive: true })
    .sort(sortField[type] || sortField.level)
    .limit(limit)
    .select('userId username discriminator globalStats economy');
};

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

// Create indexes
createIndexes(UserProfile, userIndexes).catch(console.error);

export default UserProfile;
