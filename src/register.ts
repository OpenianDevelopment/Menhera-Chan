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
];
const deleteQ: boolean = false;

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
            return console.log("\x1b[32m%s\x1b[0m", "I'm Done");
        }
        commands.forEach((command) => {
            client
                .application!.commands.create(command)
                .then((c) =>
                    console.log(
                        "Created: " + c.name + " | " + c.id + " | " + c.guildId
                    )
                )
                .catch(console.error);
        });
        return console.log("\x1b[32m%s\x1b[0m", "I'm Done");
    } catch (err) {
        console.error("Error When Registering:", err);
    }
});
