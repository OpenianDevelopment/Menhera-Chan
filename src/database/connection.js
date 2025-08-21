import mongoose from 'mongoose';
import { environment } from '../config/environment.js';
import { createLogger } from '../config/logger.js';

const logger = createLogger('Database');

/**
 * Database connection options
 */
const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

/**
 * Initialize database connection
 */
export const initializeDatabase = async () => {
  try {
    mongoose.set('strictQuery', false);

    // Connection event handlers
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

    await mongoose.connect(environment.MONGODB_URI, connectionOptions);
    logger.info('Database initialization completed');

    return mongoose.connection;
  } catch (error) {
    logger.error('Database initialization failed', { error: error.message });
    throw error;
  }
};

/**
 * Common schema options
 */
export const schemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
};

/**
 * Base schema with common fields
 */
export const createBaseSchema = (definition) => {
  return new mongoose.Schema({
    ...definition,
    createdBy: {
      type: String,
      required: false,
      index: true
    },
    updatedBy: {
      type: String,
      required: false
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  }, schemaOptions);
};

/**
 * Validation helpers
 */
export const validators = {
  discordId: {
    validator: (v) => /^\d{17,19}$/.test(v),
    message: 'Invalid Discord ID format'
  },

  discordChannel: {
    validator: (v) => !v || /^\d{17,19}$/.test(v),
    message: 'Invalid Discord channel ID format'
  },

  url: {
    validator: (v) => {
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    },
    message: 'Invalid URL format'
  },

  color: {
    validator: (v) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v),
    message: 'Invalid color format (must be hex)'
  }
};

export const createIndexes = async (model, indexes = []) => {
  try {
    for (const index of indexes) {
      await model.createIndex(index.fields, index.options || {});
    }
    logger.debug(`Indexes created for ${model.modelName}`, { count: indexes.length });
  } catch (error) {
    logger.error(`Failed to create indexes for ${model.modelName}`, { error: error.message });
  }
};

export default {
  initializeDatabase,
  schemaOptions,
  createBaseSchema,
  validators,
  createIndexes
};
