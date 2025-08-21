# Menhera-Chan
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://menhera-chan.in/">
    <img src="https://cdn.discordapp.com/avatars/731143954032230453/f3efa8736cc4d41a531035382941aee1.webp" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Menhera Chan</h3>

 
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#changes-in-v2">Changes in v2.0</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

[Menhera Chan](https://menhera-chan.in) is a multi-purpose Discord bot with tons of features. We built Menhera Chan because we wanted to replace multiple bots with just one bot. We think we were somewhat successful!

Features:
* **Moderation** - Advanced moderation tools with logging
* **Roleplay** - Fun roleplay commands
* **Music** - High-quality music playback
* **MyAnimeList and Anilist** - Anime and manga integration
* **Economy** - Virtual economy system
* **Leveling** - XP and ranking system
* **Welcome System** - Customizable welcome messages
* **And much more!**

### Built With

* [Node.js](https://nodejs.org/) (v18+ required)
* [Discord.js v14](https://discord.js.org)
* [MongoDB](https://www.mongodb.com/)
* [Canvas](https://www.npmjs.com/package/canvas) - For image generation

## Getting Started

### Prerequisites

* **Node.js 18.0.0 or higher**
  ```sh
  node --version
  ```
* **MongoDB** - Either local installation or MongoDB Atlas
* **Discord Bot Token** - Create a bot at [Discord Developer Portal](https://discord.com/developers/applications)

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/OpenianDevelopment/Menhera-Chan.git
   cd Menhera-Chan
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure the bot**
   
   Edit `Bot/botconfig.json` with your credentials:
   ```json
   {
     "owners": ["YOUR_USER_ID"],
     "prefix": "mc!",
     "token": "YOUR_BOT_TOKEN",
     "mongo_uri": "YOUR_MONGODB_CONNECTION_STRING",
     "youtube_api": "YOUR_YOUTUBE_API_KEY",
     "DBL_TOKEN": "",
     "GuildUpdates_Webhook": "",
     "MAX_PLAYLIST_SIZE": 10,
     "PRUNING": false,
     "STAY_TIME": 30
   }
   ```

4. **Start the bot**
   ```sh
   npm start
   ```
   
   Or for development:
   ```sh
   npm run dev
   ```

### Required Bot Permissions

Make sure your bot has these permissions in your Discord server:
- **Send Messages**
- **Embed Links**
- **Attach Files**
- **Read Message History**
- **Add Reactions**
- **Connect** (for music)
- **Speak** (for music)
- **Manage Roles** (for moderation)
- **Ban Members** (for moderation)
- **Kick Members** (for moderation)

## Changes in v2.0

This version includes major updates and improvements:

### ✅ **Updated Dependencies**
- **Discord.js v12 → v14** - Latest version with improved performance
- **MongoDB driver** - Updated to latest version
- **Security fixes** - All vulnerable dependencies updated

### ✅ **Breaking Changes Fixed**
- Updated all deprecated Discord.js methods
- Fixed permission system (`hasPermission` → `permissions.has`)
- Updated embed system (`MessageEmbed` → `EmbedBuilder`)
- Fixed voice state properties (`channelID` → `channelId`)
- Updated guild properties (`ownerID` → `ownerId`)

### ✅ **Improved Code Quality**
- Removed deprecated libraries (dblapi.js)
- Fixed async/await patterns
- Updated event handling
- Better error handling

### ✅ **Performance Improvements**
- Optimized database connections
- Updated mongoose configuration
- Better memory management

### 🔄 **In Progress**
- Music system overhaul (Discord.js v14 voice changes)
- Slash commands implementation
- Additional command updates

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## LICENSE
**Important!** By downloading the following program you agree to the LICENSE terms in the LICENSE file.

<!-- CONTACT -->
## Contact

**Developers:**
- [Rohan Kumar](https://github.com/rohank05) - rohan@openian.dev
- [Julio](https://github.com/july12123) - julio@openian.dev  
- [Noro](https://github.com/NORO3618) - noro@openian.dev

**Support:**
- [Discord Support Server](https://discord.com/invite/a4zkCjg)
- [Project Repository](https://github.com/OpenianDevelopment/Menhera-Chan)

---

*This bot is continuously updated and maintained. Please report any issues in our Discord server or GitHub issues.*