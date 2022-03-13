import { ApplicationCommandData, Client } from "discord.js";
require("dotenv").config();
const client = new Client({
    intents: [],
});

client.login(process.env.TOKEN);

// Someone should change the description...
const commands: ApplicationCommandData[] = [
    {
        name: "ping",
        description: "🏓 reply with bot's ping and shard id",
    },
    {
        name: "serverinfo",
        description: "Shows the info of the server",
    },
    {
        name: "avatar",
        description: "See your/user's avatar",
        options: [
            {
                name: "user",
                description: "wanted user's avatar",
                type: "USER",
            },
        ],
    },
    {
        name: "uptime",
        description: "Return bot's ready Date/time",
    },
    {
        name: "report",
        description: "Report a bug",
        type: "CHAT_INPUT",
        options: [
            {
                name: "description",
                description: "bug's description",
                type: "STRING",
                required: true,
            },
        ],
    },
    {
        name: "roleplay",
        description: "Play role play",
        type: "CHAT_INPUT",
        options: [
            {
                name: "type",
                description: "which roleplay to use",
                type: "STRING",
                choices: [
                    { name: "Kiss", value: "kiss" },
                    { name: "Lick", value: "lick" },
                    { name: "Yeet", value: "yeet" },
                    { name: "Cuddle", value: "cuddle" },
                    { name: "Bite", value: "bite" },
                    { name: "Pat", value: "pat" },
                    { name: "Bully", value: "bully" },
                    { name: "High-Five", value: "highfive" },
                    { name: "Kill", value: "kill" },
                    { name: "Cry", value: "cry" },
                    { name: "Tickle", value: "tickle" },
                    { name: "Punch", value: "punch" },
                    { name: "Smile", value: "smile" },
                    { name: "Greet", value: "greet" },
                    { name: "Tsundere", value: "tsundere" },
                ],
                required: true,
            },
            {
                name: "user",
                description: "User to do role play with",
                type: "USER",
                required: true,
            },
            {
                name: "message",
                description: "Your custom message",
                type: "STRING",
            },
        ],
    },
    {
        name: "rank",
        description: "Shows rank card",
        type: "CHAT_INPUT",
        options: [
            {
                name: "user",
                description: "Show this user's rank card",
                type: "USER",
            },
        ],
    },
    {
        name: "rank-options",
        description: "Edit the rankcard's options",
        type: "CHAT_INPUT",
        options: [
            {
                name: "help",
                description: "How to use this!??",
                type: "SUB_COMMAND",
            },
            {
                name: "bg",
                description:
                    'The background image of the rankcard ("default" for default image)',
                type: "STRING",
            },
            {
                name: "opacity",
                description: "Percentage of opacity (70 is the default)",
                type: "INTEGER",
            },
            {
                name: "track",
                description: "Sets the xp track color",
                type: "STRING",
            },
            {
                name: "text",
                description: "Sets text color",
                type: "STRING",
            },
        ],
    },
    {
        name: "mal",
        description: "Search MyAnimeList's database",
        type: "CHAT_INPUT",
        options: [
            {
                name: "anime",
                description: "Search an anime on MyAnimeList",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "Anime name",
                        type: "STRING",
                        required: true,
                    },
                ],
            },
            {
                name: "rec",
                description:
                    "Get anime recommendations by an ID of anime you like",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "id",
                        description: "Anime's id",
                        type: "NUMBER",
                        required: true,
                    },
                ],
            },
            {
                name: "user",
                description: "Search a MyAnimeList user",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "username",
                        type: "STRING",
                        required: true,
                    },
                ],
            },
        ],
    },
    {
        name: "ani",
        description: "Search AniList's database",
        type: "CHAT_INPUT",
        options: [
            {
                name: "users",
                description: "Look up anilist users",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "Username to look up",
                        type: "STRING",
                        required: true,
                    },
                ],
            },
            {
                name: "anime",
                description: "Search anime data on anilist",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "Anime's name",
                        type: "STRING",
                        required: true,
                    },
                ],
            },
            {
                name: "char",
                description: "Search for a character on anilist",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "Character's name",
                        type: "STRING",
                        required: true,
                    },
                ],
            },
            {
                name: "manga",
                description: "Search for manga in anilist's database",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "Manga name",
                        type: "STRING",
                        required: true,
                    },
                ],
            },
        ],
    },
    {
        name: "econ",
        description: "Economy",
        type: "CHAT_INPUT",
        options: [
            {
                name: "balance",
                description: "Shows Balance",
                type: "SUB_COMMAND",
            },
            {
                name: "search",
                description: "Search for Waifu",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "name to look up",
                        type: "STRING",
                        required: true,
                    },
                ],
            },
            {
                name: "sell",
                description: "Sell Waifu",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "id",
                        description: "ID of Waifu",
                        type: "INTEGER",
                        required: true,
                    },
                ],
            },
            {
                name: "buy",
                description: "Buy Waifu",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "id",
                        description: "ID of Waifu",
                        type: "INTEGER",
                        required: true,
                    },
                ],
            },
            {
                name: "inventory",
                description: "Shows Collection of Waifus",
                type: "SUB_COMMAND",
            },
            {
                name: "list",
                description: "List of wiafu/husbando",
                type: "SUB_COMMAND",
            },
            {
                name: "beg",
                description: "Beg for money",
                type: "SUB_COMMAND",
            },
        ],
    },
    {
        name: "mod",
        description: "Moderation",
        type: "CHAT_INPUT",
        options: [
            {
                name: "purge",
                description: "Remove chat messages",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "amount",
                        description: "How many messages to remove",
                        type: "INTEGER",
                        required: true,
                    },
                    {
                        name: "channel",
                        description: "channel to purge",
                        type: "CHANNEL",
                        required: false,
                    },
                ],
            },
            {
                name: "slowmode",
                description: "To set the slowmode of the channel",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "seconds",
                        description: "Time per user to send a message",
                        type: "INTEGER",
                        required: true,
                    },
                    {
                        name: "channel",
                        description: "channel to purge",
                        type: "CHANNEL",
                        required: false,
                    },
                ],
            },
            {
                name: "mute",
                description: "Mute a user",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "user to kick",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "time",
                        description: "time to mute",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "reason",
                        description: "reason to kick user",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "unmute",
                description: "Mute a user",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "user to kick",
                        type: "USER",
                        required: true,
                    },
                ],
            },
            {
                name: "unban",
                description: "Unbans a user",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "Banned user",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "reason",
                        description: "reason for the unban",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
        ],
    },
    {
        name: "settings",
        description: "to set settings",
        type: "CHAT_INPUT",
        options: [
            {
                name: "view",
                description: "to view settings",
                type: "SUB_COMMAND",
            },
            {
                name: "set",
                description: "to enable/disable a service",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "service",
                        description: "service to enable/disable",
                        type: "STRING",
                        required: true,
                        choices: [
                            { name: "welcome messages", value: "welcome" },
                            { name: "urls block", value: "url-block" },
                            { name: "mod-log", value: "mod-log" },
                            { name: "anti-spam", value: "anti-spam" },
                            { name: "experience", value: "experience" },
                        ],
                    },
                    {
                        name: "enable",
                        description: "enable (true) or disable (false)",
                        type: "BOOLEAN",
                        required: true,
                    },
                ],
            },
            {
                name: "welcome",
                description: "settings for the welcome feature",
                type: "SUB_COMMAND_GROUP",
                options: [
                    {
                        name: "channel",
                        description: "Change welcome channel's settings",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "channel",
                                description: "channel",
                                type: "CHANNEL",
                                required: true,
                            },
                            {
                                name: "message",
                                description:
                                    "message for channel, use `{server} {member}` (\\new for a new line)",
                                type: "STRING",
                                required: true,
                            },
                        ],
                    },
                    {
                        name: "dm",
                        description: "Change welcome DM's settings",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "message",
                                description:
                                    "message for dm, use `{server} {member}` (\\new for a new line)",
                                type: "STRING",
                                required: true,
                            },
                        ],
                    },
                    {
                        name: "set",
                        description: "to enable/disable a service",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "service",
                                description: "service to enable/disable",
                                type: "STRING",
                                required: true,
                                choices: [
                                    { name: "dm message", value: "dm-message" },
                                    {
                                        name: "channel message",
                                        value: "channel-message",
                                    },
                                ],
                            },
                            {
                                name: "enable",
                                description: "enable (true) or disable (false)",
                                type: "BOOLEAN",
                                required: true,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "flip",
        description: "Flips a coin",
        type: "CHAT_INPUT",
    },
    {
        name: "test",
        description: "test",
        type: "CHAT_INPUT",
    },
    {
        name: "eval",
        description: "Evaluate a peice of code",
        options: [
            {
                type: "STRING",
                name: "code",
                description: 'The "peice of code"',
                required: true,
            },
        ],
    },
];
const deleteQ: boolean = false;

client.on("ready", async () => {
    try {
        let val = 0;
        if (deleteQ) {
            const cmds = await client.application!.commands.fetch();
            cmds.forEach(async (cmd) => {
                const d = await cmd.delete();
                console.log(
                    "Deleted: " + d.name + " | " + d.id + " | " + d.guildId
                );
            });
            return console.log("\x1b[32m%s\x1b[0m", "Started deleting...");
        }
        commands.forEach(async (command) => {
            try {
                const data = await client.application!.commands.create(command);
                console.log(
                    `✅ Created:\t${data.name}\t|\t${data.id}\t|\t${data.guildId}`
                );
            } catch {
                console.log(`❎ Failed:\t${command.name}`);
            }
            val++;
            if (val >= commands.length) {
                console.log("Completed Registering\nExiting Now");
                process.exit(0);
            }
        });
        return console.log("\x1b[32m%s\x1b[0m", "Started creating...");
    } catch (err) {
        console.error("Error When Registering:", err);
    }
});
