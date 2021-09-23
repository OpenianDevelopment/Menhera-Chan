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
        name: "role-play",
        description: "Play role play",
        type: "CHAT_INPUT",
        options: [
            {
                name: "rp-type",
                description: "which roleplay to use",
                type: "STRING",
                choices: [
                    { name: "Kiss", value: "kiss" },
                    { name: "Lick", value: "lick" },
                    { name: "Yeet", value: "yeet" },
                    { name: "Cuddle", value: "cuddle" },
                    { name: "Bite", value: "bite" },
                    { name: " Pat", value: "pat" },
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
const guild_id = "";

client.on("ready", () => {
    try {
        commands.forEach((command) => {
            if (guild_id.length >= 8) {
                client.guilds.cache
                    .get(guild_id)!
                    .commands.create(command)
                    .then((c) =>
                        console.log(
                            "Created: " +
                                c.name +
                                " | " +
                                c.id +
                                " | " +
                                c.guildId
                        )
                    )
                    .catch(console.error);
            } else {
                client
                    .application!.commands.create(command)
                    .then((c) =>
                        console.log("Created: " + c.name + " | " + c.id)
                    )
                    .catch(console.error);
            }
        });
    } catch (err) {
        console.error("Error When Registering:", err);
    }
});
