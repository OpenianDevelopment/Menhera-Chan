import { jest } from '@jest/globals';

/**
 * Mock Discord.js client for testing
 */
export const createMockClient = () => ({
  user: {
    id: '123456789012345678',
    username: 'MenheraChan',
    tag: 'MenheraChan#0001',
    setActivity: jest.fn(),
    setStatus: jest.fn()
  },

  guilds: {
    cache: new Map([
      ['guild1', {
        id: 'guild1',
        name: 'Test Guild',
        ownerId: 'owner123',
        members: {
          cache: new Map(),
          fetch: jest.fn().mockResolvedValue({
            id: 'user123',
            bannable: true,
            roles: { highest: { position: 1 } }
          }),
          ban: jest.fn().mockResolvedValue()
        },
        channels: {
          fetch: jest.fn().mockResolvedValue({
            id: 'channel123',
            send: jest.fn().mockResolvedValue()
          })
        },
        bans: {
          fetch: jest.fn().mockRejectedValue(new Error('Not banned'))
        }
      }]
    ]),
    fetch: jest.fn()
  },

  users: {
    cache: new Map(),
    fetch: jest.fn().mockResolvedValue({
      id: 'user123',
      username: 'TestUser',
      tag: 'TestUser#0001',
      bot: false,
      send: jest.fn().mockResolvedValue()
    })
  },

  commands: new Map(),
  cooldowns: new Map(),

  login: jest.fn().mockResolvedValue(),
  destroy: jest.fn(),

  on: jest.fn(),
  once: jest.fn(),

  application: {
    owner: { id: 'botowner123' }
  }
});

/**
 * Mock Discord message for testing
 */
export const createMockMessage = (options = {}) => ({
  id: '987654321098765432',
  content: options.content || '!test',
  author: {
    id: options.authorId || 'user123',
    username: options.username || 'TestUser',
    tag: options.userTag || 'TestUser#0001',
    bot: options.bot || false,
    send: jest.fn().mockResolvedValue()
  },

  guild: options.guild !== null
    ? {
      id: options.guildId || 'guild123',
      name: options.guildName || 'Test Guild',
      ownerId: 'owner123',
      members: {
        fetch: jest.fn().mockResolvedValue({
          id: 'user123',
          bannable: true,
          roles: { highest: { position: 1 } }
        }),
        ban: jest.fn().mockResolvedValue()
      },
      channels: {
        fetch: jest.fn().mockResolvedValue({
          send: jest.fn().mockResolvedValue()
        })
      }
    }
    : null,

  channel: {
    id: 'channel123',
    send: jest.fn().mockResolvedValue(),
    toString: () => '#test-channel'
  },

  member: {
    id: 'user123',
    permissions: {
      has: jest.fn().mockReturnValue(true)
    },
    roles: {
      highest: { position: 2 }
    },
    bannable: true,
    kick: jest.fn().mockResolvedValue(),
    ban: jest.fn().mockResolvedValue()
  },

  mentions: {
    users: new Map(options.mentions
      ? [['user456', {
        id: 'user456',
        username: 'MentionedUser',
        tag: 'MentionedUser#0001',
        bot: false
      }]]
      : []),
    members: new Map()
  },

  reply: jest.fn().mockResolvedValue(),
  delete: jest.fn().mockResolvedValue(),

  createdTimestamp: Date.now()
});

/**
 * Mock guild for testing
 */
export const createMockGuild = (options = {}) => ({
  id: options.id || 'guild123',
  name: options.name || 'Test Guild',
  ownerId: options.ownerId || 'owner123',

  members: {
    cache: new Map(),
    fetch: jest.fn().mockResolvedValue({
      id: 'user123',
      bannable: true,
      roles: { highest: { position: 1 } }
    }),
    ban: jest.fn().mockResolvedValue()
  },

  channels: {
    cache: new Map(),
    fetch: jest.fn().mockResolvedValue({
      id: 'channel123',
      send: jest.fn().mockResolvedValue()
    })
  },

  roles: {
    cache: new Map()
  },

  iconURL: jest.fn().mockReturnValue('https://example.com/icon.png')
});

/**
 * Mock user for testing
 */
export const createMockUser = (options = {}) => ({
  id: options.id || 'user123',
  username: options.username || 'TestUser',
  discriminator: options.discriminator || '0001',
  tag: options.tag || 'TestUser#0001',
  bot: options.bot || false,

  displayAvatarURL: jest.fn().mockReturnValue('https://example.com/avatar.png'),
  send: jest.fn().mockResolvedValue(),

  createdTimestamp: Date.now()
});

/**
 * Database test helpers
 */
export const createMockDatabase = () => ({
  connect: jest.fn().mockResolvedValue(),
  disconnect: jest.fn().mockResolvedValue(),

  // Mock models
  GuildSettings: {
    findByGuildId: jest.fn().mockResolvedValue({
      guildId: 'guild123',
      prefix: '!',
      features: {
        levelSystem: { enabled: true },
        moderation: { autoMod: false }
      },
      save: jest.fn().mockResolvedValue()
    }),

    createDefault: jest.fn().mockResolvedValue({
      guildId: 'guild123',
      prefix: '!',
      features: {
        levelSystem: { enabled: true },
        moderation: { autoMod: false }
      }
    })
  },

  UserProfile: {
    findByUserId: jest.fn().mockResolvedValue({
      userId: 'user123',
      username: 'TestUser',
      discriminator: '0001',
      globalStats: {
        level: 5,
        totalXP: 1000
      },
      addXP: jest.fn().mockResolvedValue(),
      save: jest.fn().mockResolvedValue()
    }),

    createProfile: jest.fn().mockResolvedValue({
      userId: 'user123',
      username: 'TestUser',
      discriminator: '0001'
    })
  }
});

/**
 * Redis test helpers
 */
export const createMockRedis = () => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
  exists: jest.fn().mockResolvedValue(0),
  incr: jest.fn().mockResolvedValue(1),
  expire: jest.fn().mockResolvedValue(1)
});

/**
 * Test environment setup
 */
export const setupTestEnvironment = () => {
  // Mock environment variables
  process.env.NODE_ENV = 'test';
  process.env.DISCORD_TOKEN = 'test-token';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
  process.env.REDIS_URL = 'redis://localhost:6379';
  process.env.DEFAULT_PREFIX = '!';

  // Suppress console output during tests
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
};

/**
 * Clean up after tests
 */
export const teardownTestEnvironment = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};

export default {
  createMockClient,
  createMockMessage,
  createMockGuild,
  createMockUser,
  createMockDatabase,
  createMockRedis,
  setupTestEnvironment,
  teardownTestEnvironment
};
