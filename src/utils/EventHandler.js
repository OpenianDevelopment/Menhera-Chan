import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logger = createLogger('EventHandler');

/**
 * Modern event handler with ES6 modules
 */
export class EventHandler {
  constructor(client) {
    this.client = client;
    this.events = new Map();
  }

  /**
   * Load all events from the events directory
   */
  async loadEvents() {
    const eventsPath = join(__dirname, '../events');

    try {
      const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));
      let eventCount = 0;

      for (const file of eventFiles) {
        try {
          const filePath = join(eventsPath, file);
          const { default: event } = await import(`file://${filePath}`);

          if (!event || !event.name || !event.execute) {
            logger.warn(`Invalid event file: ${file}`);
            continue;
          }

          // Validate event structure
          if (this.validateEvent(event)) {
            // Register event listener
            if (event.once) {
              this.client.once(event.name, (...args) => event.execute(...args, this.client));
            } else {
              this.client.on(event.name, (...args) => event.execute(...args, this.client));
            }

            this.events.set(event.name, event);
            eventCount++;

            logger.debug(`Loaded event: ${event.name}`, {
              once: event.once || false,
              file
            });
          }
        } catch (error) {
          logger.error(`Failed to load event: ${file}`, { error: error.message });
        }
      }

      logger.info('Events loaded successfully', { total: eventCount });
      return { events: eventCount };
    } catch (error) {
      logger.error('Failed to load events', { error: error.message });
      throw error;
    }
  }

  /**
   * Validate event structure
   */
  validateEvent(event) {
    const required = ['name', 'execute'];
    const missing = required.filter(prop => !event[prop]);

    if (missing.length > 0) {
      logger.warn(`Event missing required properties: ${missing.join(', ')}`, {
        event: event.name
      });
      return false;
    }

    if (typeof event.execute !== 'function') {
      logger.warn('Event execute must be a function', {
        event: event.name
      });
      return false;
    }

    return true;
  }

  /**
   * Get event by name
   */
  getEvent(name) {
    return this.events.get(name);
  }

  /**
   * Get all events
   */
  getAllEvents() {
    return Array.from(this.events.values());
  }

  /**
   * Reload a specific event
   */
  async reloadEvent(eventName) {
    const event = this.getEvent(eventName);

    if (!event) {
      throw new Error(`Event '${eventName}' not found`);
    }

    const eventPath = join(__dirname, '../events', `${eventName}.js`);

    try {
      // Remove existing listeners
      this.client.removeAllListeners(eventName);

      // Clear module cache and reload
      delete require.cache[require.resolve(eventPath)];
      const { default: newEvent } = await import(`file://${eventPath}?update=${Date.now()}`);

      if (this.validateEvent(newEvent)) {
        // Register new listener
        if (newEvent.once) {
          this.client.once(newEvent.name, (...args) => newEvent.execute(...args, this.client));
        } else {
          this.client.on(newEvent.name, (...args) => newEvent.execute(...args, this.client));
        }

        this.events.set(newEvent.name, newEvent);
        logger.info(`Event reloaded: ${newEvent.name}`);
        return true;
      }
    } catch (error) {
      logger.error(`Failed to reload event: ${eventName}`, { error: error.message });
      throw error;
    }

    return false;
  }
}

export default EventHandler;
