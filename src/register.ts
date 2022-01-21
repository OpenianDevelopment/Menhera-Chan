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
        description: "🏓",
    },
    {
        name: "serverinfo",
        description:
            "Shows the info of the server where the command is writen in",
    },
    {
        name: "avatar",
        description: "See your/user's avatar",
        options: [
            {
                name: "user",
                description: "wanted avatar's owner",
                type: "USER",
            },
        ],
    },
    {
        name: "uptime",
        description: "Return bot's ready Date/timer",
    },
    {
        name: "report",
        description:
            "Report a bug/user (user who misused he bot, we're not he server's mods nor discord staff)",
        type: "CHAT_INPUT",
        options: [
            {
                name: "user",
                description: "which roleplay to use",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "target",
                        description: "User to report",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "reason",
                        description: "User to report",
                        type: "STRING",
                        required: true,
                    },
                ],
            },
            {
                name: "bug",
                description: "User to do role play with",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "description",
                        description: "The bug's description",
                        type: "STRING",
                        required: true,
                    },
                ],
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
                description: "Show <this user>'s rank card",
                type: "USER",
                required: false,
            },
        ],
    },
    {
        name: "rank-options",
        description: "Edit the rankcard's options",
        type: "CHAT_INPUT",
        options: [
            {
                name: "option",
                description: "Option to edit",
                type: "STRING",
                choices: [
                    { name: "How to use this?", value: "help" },
                    { name: "Background Image", value: "bg" },
                    { name: "Opacity", value: "op" },
                    { name: "Track Color", value: "track" },
                    { name: "Text Color", value: "text" },
                ],
                required: true,
            },
            {
                name: "input",
                description: "Option's input value",
                type: "STRING",
                required: false,
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
                        description: "Liked anime's id",
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
                type: "SUB_COMMAND"
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
                type:"SUB_COMMAND",
                options:[
                    {
                        name:"id",
                        description:"ID of Waifu",
                        type:"INTEGER",
                        required:true,
                    }
                ]
            },
            {
                name: "buy",
                description: "Buy Waifu",
                type:"SUB_COMMAND",
                options:[
                    {
                        name:"id",
                        description:"ID of Waifu",
                        type:"INTEGER",
                        required:true,
                    }
                ]
            },
            {
                name: "inventory",
                description: "Shows Collection of Waifus",
                type:"SUB_COMMAND"
            },
            {
                name: "list",
                description: "List of wiafu/husbando",
                type:"SUB_COMMAND"
            },
            {
                name:"beg",
                description: "Beg for money",
                type:"SUB_COMMAND"
            }
        ],
    },
    {
        name: "test",
        description: "test",
        type: "CHAT_INPUT"
    },
];
const deleteQ: boolean = false ;

client.on("ready", async () => {
    try {
        if (deleteQ) {
            const cmds = await client.application!.commands.fetch();
            cmds.forEach((cmd) => {
                cmd.delete()
                    .then((c) =>
                        console.log(
                            "Deleted: " +
                                c.name +
                                " | " +
                                c.id +
                                " | " +
                                c.guildId
                        )
                    )
                    .catch(console.error);
            });
            return console.log("\x1b[32m%s\x1b[0m", "Started deleting...");
        }
        var val = 0
        commands.forEach(async(command) => {
            var data = await client.application!.commands.create(command)
                console.log(
                    "Created: " + data.name + " | " + data.id + " | " + data.guildId
                )
                val++
                if(val == commands.length){
                    process.exit(0)
                }
        });
        return console.log("\x1b[32m%s\x1b[0m", "Started creating...");
    } catch (err) {
        console.error("Error When Registering:", err);
    }
});
