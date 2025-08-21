import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logger = createLogger('CommandHandler');

/**
 * Modern command handler with ES6 modules
 */
export class CommandHandler {
  constructor(client) {
    this.client = client;
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.categories = new Set();
  }

  /**
   * Load all commands from the commands directory
   */
  async loadCommands() {
    const commandsPath = join(__dirname, '../commands');

    try {
      const categories = readdirSync(commandsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      let commandCount = 0;

      for (const category of categories) {
        const categoryPath = join(commandsPath, category);
        const commandFiles = readdirSync(categoryPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
          try {
            const filePath = join(categoryPath, file);
            const { default: command } = await import(`file://${filePath}`);

            if (!command || !command.name || !command.execute) {
              logger.warn(`Invalid command file: ${file}`, { category });
              continue;
            }

            // Add category to command
            command.category = category;

            // Validate command structure
            if (this.validateCommand(command)) {
              this.commands.set(command.name, command);
              this.categories.add(category);
              commandCount++;

              // Register aliases
              if (command.aliases) {
                for (const alias of command.aliases) {
                  this.commands.set(alias, command);
                }
              }

              logger.debug(`Loaded command: ${command.name}`, {
                category,
                aliases: command.aliases?.length || 0
              });
            }
          } catch (error) {
            logger.error(`Failed to load command: ${file}`, {
              category,
              error: error.message
            });
          }
        }
      }

      logger.info('Commands loaded successfully', {
        total: commandCount,
        categories: categories.length
      });

      return { commands: commandCount, categories: categories.length };
    } catch (error) {
      logger.error('Failed to load commands', { error: error.message });
      throw error;
    }
  }

  /**
   * Validate command structure
   */
  validateCommand(command) {
    const required = ['name', 'description', 'execute'];
    const missing = required.filter(prop => !command[prop]);

    if (missing.length > 0) {
      logger.warn(`Command missing required properties: ${missing.join(', ')}`, {
        command: command.name
      });
      return false;
    }

    // Validate permissions
    if (command.permissions && !Array.isArray(command.permissions)) {
      logger.warn('Command permissions must be an array', {
        command: command.name
      });
      return false;
    }

    // Validate cooldown
    if (command.cooldown && (typeof command.cooldown !== 'number' || command.cooldown < 0)) {
      logger.warn('Command cooldown must be a positive number', {
        command: command.name
      });
      return false;
    }

    return true;
  }

  /**
   * Execute a command
   */
  async executeCommand(message, commandName, args) {
    const command = this.commands.get(commandName.toLowerCase());

    if (!command) {
      return false;
    }

    try {
      // Check permissions
      if (!this.checkPermissions(message, command)) {
        return false;
      }

      // Check cooldown
      if (!this.checkCooldown(message, command)) {
        return false;
      }

      // Check if command requires arguments
      if (command.args && (!args || args.length === 0)) {
        await message.reply({
          content: `❌ This command requires arguments!\n**Usage:** \`${command.usage || command.name}\``
        });
        return false;
      }

      // Execute command
      await command.execute(message, args, this.client);

      // Log command usage
      logger.command(
        command.name,
        message.author,
        message.guild,
        { args: args?.length || 0 }
      );

      return true;
    } catch (error) {
      logger.error(`Command execution error: ${command.name}`, {
        error: error.message,
        user: message.author.tag,
        guild: message.guild?.name || 'DM'
      });

      await message.reply({
        content: '❌ An error occurred while executing this command.'
      }).catch(() => {});

      return false;
    }
  }

  /**
   * Check user permissions
   */
  checkPermissions(message, command) {
    if (!command.permissions || command.permissions.length === 0) {
      return true;
    }

    // Check if user is bot owner
    if (message.author.id === this.client.ownerId) {
      return true;
    }

    // Check if in DM and command doesn't allow DMs
    if (!message.guild && !command.dmAllowed) {
      message.reply('❌ This command can only be used in servers.').catch(() => {});
      return false;
    }

    // Check Discord permissions
    if (message.guild) {
      const memberPermissions = message.member.permissions;
      const hasPermission = command.permissions.some(permission =>
        memberPermissions.has(permission)
      );

      if (!hasPermission) {
        message.reply({
          content: `❌ You don't have permission to use this command.\n**Required:** ${command.permissions.join(', ')}`
        }).catch(() => {});
        return false;
      }
    }

    return true;
  }

  /**
   * Check command cooldown
   */
  checkCooldown(message, command) {
    if (!command.cooldown || command.cooldown <= 0) {
      return true;
    }

    const cooldownKey = `${command.name}-${message.author.id}`;
    const now = Date.now();

    if (this.cooldowns.has(cooldownKey)) {
      const expirationTime = this.cooldowns.get(cooldownKey) + (command.cooldown * 1000);

      if (now < expirationTime) {
        const timeLeft = Math.ceil((expirationTime - now) / 1000);
        message.reply({
          content: `⏰ Please wait ${timeLeft} second(s) before using \`${command.name}\` again.`
        }).catch(() => {});
        return false;
      }
    }

    this.cooldowns.set(cooldownKey, now);

    // Clean up expired cooldowns
    setTimeout(() => {
      this.cooldowns.delete(cooldownKey);
    }, command.cooldown * 1000);

    return true;
  }

  /**
   * Get command by name or alias
   */
  getCommand(name) {
    return this.commands.get(name.toLowerCase());
  }

  /**
   * Get all commands in a category
   */
  getCommandsByCategory(category) {
    return Array.from(this.commands.values())
      .filter((cmd, index, arr) =>
        cmd.category === category &&
        arr.findIndex(c => c.name === cmd.name) === index
      );
  }

  /**
   * Get all categories
   */
  getCategories() {
    return Array.from(this.categories);
  }

  /**
   * Search commands
   */
  searchCommands(query) {
    const results = [];
    const lowercaseQuery = query.toLowerCase();

    for (const command of this.commands.values()) {
      if (command.name.includes(lowercaseQuery) ||
          command.description.toLowerCase().includes(lowercaseQuery) ||
          command.aliases?.some(alias => alias.includes(lowercaseQuery))) {
        // Avoid duplicates
        if (!results.find(cmd => cmd.name === command.name)) {
          results.push(command);
        }
      }
    }

    return results;
  }

  /**
   * Reload a specific command
   */
  async reloadCommand(commandName) {
    const command = this.getCommand(commandName);

    if (!command) {
      throw new Error(`Command '${commandName}' not found`);
    }

    const commandPath = join(__dirname, '../commands', command.category, `${command.name}.js`);

    try {
      // Clear module cache
      delete require.cache[require.resolve(commandPath)];

      // Reload command
      const { default: newCommand } = await import(`file://${commandPath}?update=${Date.now()}`);

      if (this.validateCommand(newCommand)) {
        newCommand.category = command.category;
        this.commands.set(newCommand.name, newCommand);

        // Update aliases
        if (newCommand.aliases) {
          for (const alias of newCommand.aliases) {
            this.commands.set(alias, newCommand);
          }
        }

        logger.info(`Command reloaded: ${newCommand.name}`);
        return true;
      }
    } catch (error) {
      logger.error(`Failed to reload command: ${commandName}`, { error: error.message });
      throw error;
    }

    return false;
  }
}

export default CommandHandler;
