import winston from 'winston';
import { environment } from './environment.js';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Create logs directory if it doesn't exist
if (!existsSync(environment.LOGS_DIR)) {
  mkdirSync(environment.LOGS_DIR, { recursive: true });
}

/**
 * Custom log format
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    if (stack) {
      log += `\n${stack}`;
    }

    return log;
  })
);

/**
 * Create logger instance
 */
const logger = winston.createLogger({
  level: environment.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: { service: 'menhera-chan-bot' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),

    // File transports
    new winston.transports.File({
      filename: join(environment.LOGS_DIR, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: join(environment.LOGS_DIR, 'combined.log')
    })
  ]
});

/**
 * Log levels for different contexts
 */
export const createLogger = (context) => ({
  info: (message, meta = {}) => logger.info(message, { context, ...meta }),
  warn: (message, meta = {}) => logger.warn(message, { context, ...meta }),
  error: (message, meta = {}) => logger.error(message, { context, ...meta }),
  debug: (message, meta = {}) => logger.debug(message, { context, ...meta }),
  command: (commandName, user, guild, meta = {}) =>
    logger.info(`Command executed: ${commandName}`, {
      context,
      user: user.tag,
      userId: user.id,
      guild: guild?.name || 'DM',
      guildId: guild?.id || null,
      ...meta
    }),
  moderate: (action, moderator, target, reason, guild, meta = {}) =>
    logger.info(`Moderation action: ${action}`, {
      context,
      action,
      moderator: moderator.tag,
      moderatorId: moderator.id,
      target: target.tag || target.user?.tag,
      targetId: target.id || target.user?.id,
      reason,
      guild: guild.name,
      guildId: guild.id,
      ...meta
    })
});

export default logger;
