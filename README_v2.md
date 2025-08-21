# 🌸 Menhera-Chan Discord Bot v2.0

> A modern, feature-rich Discord bot built with ES6 modules, Redis caching, and comprehensive testing

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue.svg)](https://discord.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.2+-green.svg)](https://mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-6.0+-red.svg)](https://redis.io/)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)

## ✨ Features

### 🎮 Core Features
- **Moderation System** - Advanced auto-moderation with customizable rules
- **Leveling System** - XP-based ranking with role rewards
- **Economy System** - Virtual currency, daily rewards, and gambling
- **Music Player** - High-quality music playback with queue management
- **Custom Commands** - Create and manage custom server commands
- **Starboard** - Highlight popular messages automatically

### 🔧 Technical Features
- **ES6 Modules** - Modern JavaScript with import/export syntax
- **Redis Caching** - High-performance caching for better response times
- **Database Optimization** - MongoDB with proper indexing and aggregation
- **Comprehensive Testing** - Unit and integration tests with Jest
- **Auto-moderation** - Spam detection, bad word filtering, anti-raid
- **Real-time Analytics** - Server statistics and user activity tracking

### 🎨 Customization
- **Per-server Configuration** - Unique settings for each Discord server
- **Role Management** - Automated role assignment and management
- **Custom Prefixes** - Set unique command prefixes per server
- **Webhook Logging** - Advanced logging with Discord webhooks
- **Premium Features** - Enhanced functionality for premium servers

## 🚀 Quick Start

### Prerequisites
- **Node.js 18.0+** - [Download Node.js](https://nodejs.org/)
- **MongoDB 4.4+** - [Install MongoDB](https://docs.mongodb.com/manual/installation/)
- **Redis 6.0+** (Optional) - [Install Redis](https://redis.io/download)
- **Discord Bot Token** - [Create a Discord Application](https://discord.com/developers/applications)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/OpenianDevelopment/Menhera-Chan.git
cd Menhera-Chan
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
nano .env  # Edit with your configuration
```

4. **Required environment variables**
```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here

# Database
MONGODB_URI=mongodb://localhost:27017/menhera-chan

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# Bot Settings
DEFAULT_PREFIX=!
OWNER_IDS=your_discord_user_id_here
```

5. **Start the bot**
```bash
npm start
```

### Development Setup

```bash
# Install development dependencies
npm install

# Run tests
npm test

# Run with file watching (development)
npm run dev

# Code quality check
npm run lint
npm run lint:fix
```

## 📁 Project Structure

```
src/
├── bot.js                 # Main bot entry point
├── config/
│   ├── environment.js     # Environment configuration
│   └── logger.js          # Winston logging system
├── database/
│   ├── connection.js      # MongoDB connection
│   └── models/
│       ├── GuildSettings.js    # Server configuration
│       └── UserProfile.js      # User data and statistics
├── services/
│   └── redis.js           # Redis caching service
├── utils/
│   ├── CommandHandler.js  # Command management system
│   └── EventHandler.js    # Event handling system
├── commands/              # Bot commands organized by category
│   ├── moderation/       # Moderation commands
│   ├── music/            # Music system commands
│   ├── fun/              # Entertainment commands
│   └── general/          # General utility commands
├── events/               # Discord event handlers
└── test/                 # Comprehensive test suite
```

## 🛠️ Configuration

### Discord Permissions

The bot requires the following permissions:
- `View Channels`
- `Send Messages`
- `Send Messages in Threads`
- `Embed Links`
- `Attach Files`
- `Read Message History`
- `Use External Emojis`
- `Add Reactions`
- `Manage Messages` (for moderation)
- `Manage Roles` (for role management)
- `Kick Members` / `Ban Members` (for moderation)
- `Connect` / `Speak` (for music features)

### Bot Intents

Required Discord Gateway Intents:
- `GUILDS` - Access server information
- `GUILD_MESSAGES` - Read messages for commands
- `MESSAGE_CONTENT` - Access message content
- `GUILD_MEMBERS` - Member management
- `GUILD_VOICE_STATES` - Music functionality
- `GUILD_MESSAGE_REACTIONS` - Reaction-based features

### Server Setup

1. **Invite the bot** using this URL format:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

2. **Configure server settings** using `!setup` command
3. **Set moderation channels** for logging
4. **Configure auto-roles** and welcome messages
5. **Customize prefix** if desired

## 🎵 Music System

### Requirements
- Voice channel permissions
- YouTube API key (optional, for enhanced features)
- Spotify credentials (optional, for playlist support)

### Supported Sources
- YouTube (direct links and search)
- Spotify (playlists and tracks)
- SoundCloud
- Direct audio file URLs

### Music Commands
```bash
!play <song>     # Play a song or add to queue
!skip            # Skip current song
!queue           # View current queue
!volume <1-100>  # Adjust volume
!pause / !resume # Control playbook
!lyrics          # Show song lyrics
```

## 🔍 Moderation Features

### Auto-Moderation
- **Anti-Spam** - Configurable message rate limiting
- **Anti-Raid** - Automatic raid detection and prevention
- **Bad Word Filter** - Customizable word blacklist
- **Anti-Invite** - Discord invite link detection
- **Mass Mention Protection** - Prevent spam mentions

### Moderation Commands
```bash
!ban <user> [reason]     # Ban a member
!kick <user> [reason]    # Kick a member
!mute <user> [duration]  # Mute a member
!warn <user> [reason]    # Warn a member
!modlogs                 # View moderation history
!automod setup           # Configure auto-moderation
```

## 📊 Economy System

### Features
- Daily rewards with streak bonuses
- Work commands for earning currency
- Gambling games (slots, blackjack, etc.)
- Shop system with purchasable items
- User inventory management
- Leaderboards and statistics

### Economy Commands
```bash
!daily           # Claim daily reward
!work            # Work for currency
!balance         # Check your balance
!shop            # Browse available items
!buy <item>      # Purchase an item
!leaderboard     # View top users
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test src/test/commands/ban.test.js

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Categories
- **Unit Tests** - Individual command and utility testing
- **Integration Tests** - Database and service integration
- **Mock Tests** - Discord.js mocking for isolated testing
- **Performance Tests** - Response time and memory usage

## 🐛 Troubleshooting

### Common Issues

**Bot not responding to commands:**
- Check if bot has message content intent
- Verify bot permissions in the channel
- Check if the prefix is correct
- Review bot logs for errors

**Database connection issues:**
- Ensure MongoDB is running
- Verify connection string in .env
- Check network connectivity
- Review MongoDB logs

**Music not working:**
- Verify voice channel permissions
- Check if Discord.js voice dependencies are installed
- Ensure bot can connect to voice channels
- Review audio source availability

**Redis caching issues:**
- Redis is optional; bot works without it
- Check Redis server status
- Verify Redis URL in environment
- Review Redis logs for connection issues

### Getting Help

1. **Check the logs** - Bot outputs detailed error information
2. **Review configuration** - Ensure all required settings are correct
3. **Test in development** - Use `npm run dev` for detailed debugging
4. **Submit an issue** - [GitHub Issues](https://github.com/OpenianDevelopment/Menhera-Chan/issues)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Write tests for new features
- Use modern ES6+ syntax
- Document complex functions
- Follow conventional commit messages

## 📋 Changelog

### v2.0.0 - Complete Modernization
- ✨ **ES6 Module System** - Complete migration from CommonJS
- 🚀 **Redis Integration** - Caching and rate limiting
- 🧪 **Comprehensive Testing** - Jest testing framework
- 📊 **Enhanced Database** - Modern schemas with validation
- 🎨 **Code Quality** - ESLint and modern standards
- 🔧 **Configuration System** - Environment-based setup
- 📝 **Documentation** - Complete API and usage docs

### v1.x - Legacy Version
- Basic Discord.js v12 implementation
- CommonJS module system
- Limited testing coverage

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Discord.js** - Powerful Discord API wrapper
- **MongoDB** - Flexible document database
- **Redis** - High-performance caching
- **Jest** - JavaScript testing framework
- **Winston** - Logging library
- **ESLint** - Code quality tool

## 📞 Support

- **Documentation**: [Wiki](https://github.com/OpenianDevelopment/Menhera-Chan/wiki)
- **Issues**: [GitHub Issues](https://github.com/OpenianDevelopment/Menhera-Chan/issues)
- **Discussions**: [GitHub Discussions](https://github.com/OpenianDevelopment/Menhera-Chan/discussions)
- **Discord**: [Support Server](https://discord.gg/your-server-link)

---

<div align="center">
  <b>🌸 Built with ❤️ by the OpenianDevelopment team 🌸</b>
</div>