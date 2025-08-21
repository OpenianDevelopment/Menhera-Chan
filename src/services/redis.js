import Redis from 'ioredis';
import { environment } from '../config/environment.js';
import { createLogger } from '../config/logger.js';

const logger = createLogger('Redis');

/**
 * Redis client instance
 */
let redisClient = null;

/**
 * Initialize Redis connection
 */
export const initializeRedis = async () => {
  try {
    const redisConfig = {
      host: new URL(environment.REDIS_URL).hostname,
      port: new URL(environment.REDIS_URL).port || 6379,
      password: environment.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
      lazyConnect: true
    };

    redisClient = new Redis(redisConfig);

    redisClient.on('connect', () => {
      logger.info('Redis connection established');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis connection error', { error: err.message });
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Failed to initialize Redis', { error: error.message });
    throw error;
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initializeRedis() first.');
  }
  return redisClient;
};

/**
 * Cache service with Redis
 */
export class CacheService {
  constructor() {
    this.client = null;
  }

  /**
   * Initialize the cache service
   */
  initialize() {
    this.client = getRedisClient();
  }

  /**
   * Get client instance (with fallback)
   */
  getClient() {
    if (!this.client) {
      try {
        this.client = getRedisClient();
      } catch {
        return null;
      }
    }
    return this.client;
  }

  /**
   * Set cache with expiration
   */
  async set(key, value, ttl = 3600) {
    const client = this.getClient();
    if (!client) return false;

    try {
      const serialized = JSON.stringify(value);
      await client.setex(key, ttl, serialized);
      logger.debug('Cache set', { key, ttl });
      return true;
    } catch (error) {
      logger.error('Cache set error', { key, error: error.message });
      return false;
    }
  }

  /**
   * Get cache value
   */
  async get(key) {
    const client = this.getClient();
    if (!client) return null;

    try {
      const value = await client.get(key);
      if (!value) return null;

      const parsed = JSON.parse(value);
      logger.debug('Cache hit', { key });
      return parsed;
    } catch (error) {
      logger.error('Cache get error', { key, error: error.message });
      return null;
    }
  }

  /**
   * Delete cache key
   */
  async del(key) {
    const client = this.getClient();
    if (!client) return false;

    try {
      await client.del(key);
      logger.debug('Cache deleted', { key });
      return true;
    } catch (error) {
      logger.error('Cache delete error', { key, error: error.message });
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key) {
    const client = this.getClient();
    if (!client) return false;

    try {
      const exists = await client.exists(key);
      return Boolean(exists);
    } catch (error) {
      logger.error('Cache exists error', { key, error: error.message });
      return false;
    }
  }

  /**
   * Set with expiration at specific time
   */
  async setWithExpiry(key, value, expireAt) {
    const client = this.getClient();
    if (!client) return false;

    try {
      const serialized = JSON.stringify(value);
      await client.set(key, serialized);
      await client.expireat(key, Math.floor(expireAt / 1000));
      logger.debug('Cache set with expiry', { key, expireAt });
      return true;
    } catch (error) {
      logger.error('Cache set with expiry error', { key, error: error.message });
      return false;
    }
  }

  /**
   * Increment counter
   */
  async incr(key, ttl = 3600) {
    const client = this.getClient();
    if (!client) return 1;

    try {
      const value = await client.incr(key);
      if (value === 1) {
        await client.expire(key, ttl);
      }
      return value;
    } catch (error) {
      logger.error('Cache increment error', { key, error: error.message });
      return 1;
    }
  }

  /**
   * Add to set
   */
  async sadd(key, ...members) {
    const client = this.getClient();
    if (!client) return 0;

    try {
      return await client.sadd(key, ...members);
    } catch (error) {
      logger.error('Cache set add error', { key, error: error.message });
      return 0;
    }
  }

  /**
   * Check if member exists in set
   */
  async sismember(key, member) {
    const client = this.getClient();
    if (!client) return false;

    try {
      return Boolean(await client.sismember(key, member));
    } catch (error) {
      logger.error('Cache set member check error', { key, error: error.message });
      return false;
    }
  }

  /**
   * Remove from set
   */
  async srem(key, ...members) {
    const client = this.getClient();
    if (!client) return 0;

    try {
      return await client.srem(key, ...members);
    } catch (error) {
      logger.error('Cache set remove error', { key, error: error.message });
      return 0;
    }
  }
}

/**
 * Rate limiting service
 */
export class RateLimitService {
  constructor() {
    this.client = null;
  }

  /**
   * Initialize the rate limit service
   */
  initialize() {
    this.client = getRedisClient();
  }

  /**
   * Get client instance (with fallback)
   */
  getClient() {
    if (!this.client) {
      try {
        this.client = getRedisClient();
      } catch {
        return null;
      }
    }
    return this.client;
  }

  /**
   * Check and update rate limit
   */
  async checkRateLimit(key, limit, window) {
    const client = this.getClient();

    if (!client) {
      // Allow request if Redis is not available
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: Date.now() + (window * 1000),
        total: limit
      };
    }

    try {
      const current = await client.incr(key);

      if (current === 1) {
        await client.expire(key, window);
      }

      const ttl = await client.ttl(key);

      return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
        resetTime: Date.now() + (ttl * 1000),
        total: limit
      };
    } catch (error) {
      logger.error('Rate limit check error', { key, error: error.message });
      // Allow request on error to avoid blocking users
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: Date.now() + (window * 1000),
        total: limit
      };
    }
  }
}

export const cacheService = new CacheService();
export const rateLimitService = new RateLimitService();

export default {
  initializeRedis,
  getRedisClient,
  CacheService,
  RateLimitService,
  cacheService,
  rateLimitService
};
