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
                required: false,
            },
        ],
    },
    {
        name: "rp",
        description: "uh.. idk",
        type: "CHAT_INPUT",
        options: [
            {
                name: "kiss",
                description:
                    "just a normal kiss, not kiss of death or whatever",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "lick",
                description: "just a normal lic... wait tf?",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "yeet",
                description: "To literally yeet someone away",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "cuddle",
                description: "cuddling with qts, like menhera u know",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "bite",
                description: "Hope it doesn't bleed",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "pat",
                description: "a pat, that's it",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "bully",
                description: "to booli users in a... nice way?",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "highfive",
                description: "making friend with highfive is good, right?",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "kill",
                description: "Got bored of a user? just get rid of em",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "cry",
                description: "Just let it out..",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "tickle",
                description: "IF you want someone to open to you, tickle them!",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "punch",
                description: "Punching bad guys to stay safe",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "smile",
                description: "Happy? express it out!",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "greet",
                description: "Saw a qt? greet them! quickly!!",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
            },
            {
                name: "tsundere",
                description: "I-it's not like i m-made this f-f-for m-myself",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to use the rp on",
                        type: "USER",
                        required: true,
                    },
                    {
                        name: "text",
                        description:
                            "You message to the user, if you want to tho",
                        type: "STRING",
                        required: false,
                    },
                ],
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
