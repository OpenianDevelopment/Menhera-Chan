import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Environment configuration
 */
export const environment = {
  // Application
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 3000,

  // Discord
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/menhera-chan',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // API Keys
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,

  // Bot Settings
  DEFAULT_PREFIX: process.env.DEFAULT_PREFIX || '!',
  OWNER_IDS: process.env.OWNER_IDS?.split(',') || [],

  // Security
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  // Features
  ENABLE_DASHBOARD: process.env.ENABLE_DASHBOARD === 'true',
  ENABLE_MUSIC: process.env.ENABLE_MUSIC === 'true',
  ENABLE_XP_SYSTEM: process.env.ENABLE_XP_SYSTEM !== 'false',

  // Paths
  ROOT_DIR: join(__dirname, '../..'),
  LOGS_DIR: join(__dirname, '../../logs'),
  ASSETS_DIR: join(__dirname, '../../assets')
};

/**
 * Validate required environment variables
 */
export const validateEnvironment = () => {
  const required = ['DISCORD_TOKEN'];
  const missing = required.filter(key => !environment[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export default environment;
