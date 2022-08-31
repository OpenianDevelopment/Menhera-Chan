import { ApplicationCommandData, Client } from "discord.js";
import config from "./utils/config";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

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
                name: "show",
                description: "Show rank card",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "Show this user's rank card",
                        type: "USER",
                    },
                ],
            },
            {
                name: "help",
                description: "How to change card appearance!??",
                type: "SUB_COMMAND",
            },
            {
                name: "set",
                description: "Change rank card's appearance",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "bg",
                        description:
                            'The background image of the rankcard ("default" for default image)',
                        type: "STRING",
                    },
                    {
                        name: "opacity",
                        description:
                            "Percentage of opacity (70 is the default)",
                        type: "INTEGER",
                    },
                    {
                        name: "track",
                        description: "Sets the xp bar color",
                        type: "STRING",
                    },
                    {
                        name: "text",
                        description: "Sets text color",
                        type: "STRING",
                    },
                ],
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
                description: "Search for a MyAnimeList user",
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
                name: "bal",
                description: "Shows Balance",
                type: "SUB_COMMAND",
            },
            {
                name: "search",
                description: "Search for a character",
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
                description: "Sell a character",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "id",
                        description: "ID of the character",
                        type: "INTEGER",
                        required: true,
                    },
                ],
            },
            {
                name: "buy",
                description: "Buy a character",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "id",
                        description: "ID of the character",
                        type: "INTEGER",
                        required: true,
                    },
                ],
            },
            {
                name: "inventory",
                description: "Shows your collection of characters",
                type: "SUB_COMMAND",
            },
            {
                name: "list",
                description: "List of characters",
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
                        description:
                            "channel to change slowmode in (if empty changes sm in current channel)",
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
                        description: "user to mute",
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
                        description: "reason to mute user",
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
                        description: "user to unmute",
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
            {
                name: "warn",
                description: "Warn a user",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "User to warn",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "reason",
                        description: "Reason for the warn",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "delwarn",
                description: "Deletes a warn by id",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "warn-id",
                        description: "Warn ID",
                        type: "STRING",
                        required: true,
                    },
                ],
            },
            {
                name: "warnings",
                description: "Get the warnings of a user",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The User",
                        type: "USER",
                        required: true,
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
                description: "to toggle a service",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "service",
                        description: "service to toggle",
                        type: "STRING",
                        required: true,
                        choices: [
                            { name: "welcome feature", value: "welcome" },
                            //! Their Commands Are Not Finished Yet
                            //{ name: "mod-log feature", value: "mod-log" },
                            //{ name: "anti-spam feature", value: "anti-spam" },
                            {
                                name: "experience points feature",
                                value: "experience",
                            },
                            { name: "starboard feature", value: "starboard" },
                            { name: "invite-log feature", value: "invite-log" },
                            {
                                name: "economy feature (global)",
                                value: "economy",
                            },
                        ],
                    },
                    {
                        name: "toggle",
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
                                required: false,
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
                        description: "to toggle a service",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "service",
                                description: "service to toggle",
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
                                name: "toggle",
                                description: "enable (true) or disable (false)",
                                type: "BOOLEAN",
                                required: true,
                            },
                        ],
                    },
                ],
            },
            {
                name: "starboard",
                description: "settings for the starboard feature",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "channel",
                        description: "Change starboard channel",
                        type: "CHANNEL",
                        required: false,
                    },
                    {
                        name: "min-stars",
                        description:
                            "Change the minimum stars requirement to star a message",
                        type: "INTEGER",
                        required: false,
                    },
                ],
            },
            {
                name: "invitelog",
                description: "settings for the invitelog feature",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "channel",
                        description: "Change the invitelog channel",
                        type: "CHANNEL",
                        required: true,
                    },
                ],
            },
            {
                name: "exp",
                description: "Change Exp Settings",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "increment",
                        description:
                            "Change exp given per messages (per cooldown)",
                        type: "INTEGER",
                        required: false,
                    },
                    {
                        name: "exp-cooldown",
                        description: "Change the exp cooldown between messages",
                        type: "INTEGER",
                        required: false,
                    },
                    {
                        name: "log-channel",
                        description: "Set exp log channel",
                        type: "CHANNEL",
                        required: false,
                    },
                    {
                        name: "add-blacklist-channel",
                        description: "Add channel to exp blacklist",
                        type: "CHANNEL",
                        required: false,
                    },
                    {
                        name: "remove-blacklist-channel",
                        description: "Remove a channel from exp blacklist",
                        type: "CHANNEL",
                        required: false,
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
        name: "rps",
        description: "play an rps game with a friend! or with me",
        type: "CHAT_INPUT",
        options: [
            {
                name: "user",
                description: "friend to play rps with",
                type: "USER",
                required: false,
            },
        ],
    },
    {
        name: "help",
        description: "Search for a command",
        options: [
            {
                type: "STRING",
                name: "query",
                description: "Search query",
                required: true,
            },
        ],
    },
    {
        name: "tag",
        description: "Create a tag for your server!",
        options: [
            {
                name: "create",
                description: "Create a custom tag!",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "Tag name",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "reply",
                        description:
                            "Whether to reply to the message (true) or just send it (false)",
                        type: "BOOLEAN",
                        required: true,
                    },
                    {
                        name: "content",
                        description: `tag content, for more info visit ${config.links.website}/embed#htu`,
                        type: "STRING",
                        required: false,
                    },
                    {
                        name: "embed",
                        description: `Paste the object you copy from ${config.links.website}/embed`,
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "edit",
                description: "Edits a tag!",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "tag name",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "content",
                        description: "tag text content",
                        type: "STRING",
                        required: false,
                    },
                    {
                        name: "embed",
                        description: `Paste the object you copy from ${config.links.website}/embed`,
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "delete",
                description: "Deletes a tag!",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "tag name",
                        type: "STRING",
                        required: true,
                    },
                ],
            },
        ],
    },
];
client.on("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}\n`);
    try {
        const argv1 = process.argv.slice(2)[0];
        if (!argv1) {
            const rl = readline.createInterface({ input, output });
            rl.question(
                "Do you want to [create] new commands or [delete] current ones? ",
                async (reply) => {
                    await CreateOrDelete(reply);
                    rl.close();
                }
            );
        } else {
            await CreateOrDelete(argv1);
        }
    } catch (err) {
        console.error("Error When Registering:", err);
    }
});

async function CreateOrDelete(reply: string) {
    let val = 0;
    if (reply.toLowerCase().startsWith("c")) {
        commands.forEach(async (command) => {
            try {
                const data = await client.application!.commands.create(command);
                console.log(
                    `✅ Created:\t${data.name}\t|\t${data.id}\t|\t${data.guildId}`
                );
            } catch (err) {
                console.log("\x1b[31m%s\x1b[0m", `❎ Failed:\t${command.name}`);
                console.error(err);
            }
            val++;
            if (val >= commands.length) {
                console.log(
                    "\x1b[36m%s\x1b[0m",
                    "Completed Registering\nExiting Now"
                );
                process.exit(0);
            }
        });
        console.log("\x1b[32m%s\x1b[0m", "Started creating...");
    } else if (reply.toLowerCase().startsWith("d")) {
        const cmds = await client.application!.commands.fetch();
        if (cmds.size < 1) {
            console.log("\x1b[31m%s\x1b[0m", `No command found...`);
        } else {
            cmds.forEach(async (cmd) => {
                try {
                    const d = await cmd.delete();
                    console.log(
                        `✅ Deleted:\t${d.name}\t|\t${d.id}\t|\t${d.guildId}`
                    );
                } catch (err) {
                    console.log("\x1b[31m%s\x1b[0m", `❎ Failed:\t${cmd.name}`);
                    console.error(err);
                }
                val++;
                if (val >= cmds.size) {
                    console.log(
                        "\x1b[36m%s\x1b[0m",
                        "Finished Deleting\nExiting Now"
                    );
                    process.exit(0);
                }
            });
            console.log("\x1b[31m%s\x1b[0m", "Started deleting...");
        }
    } else {
        console.error("\nYou can only use (C)reate or (D)elete");
        process.exit(0);
    }
}
