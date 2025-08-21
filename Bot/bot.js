//Requirements
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const { token, mongo_uri } = require("./botconfig.json");

// Initialize Discord client with Discord.js v14 syntax
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites
    ],
    partials: [
        Partials.Message,
        Partials.Reaction,
        Partials.Channel,
        Partials.User
    ]
});

process
    .on("uncaughtException", (err) => {
        console.log("UNCAUGHT", err);
    })
    .on("uncaughtExceptionMonitor", (err) => {
        console.log("UNCAUGHT MONITOR", err);
   })
    .on("unhandledRejection", (err) => {
        console.log("UNHANDLED", err);
    });

// Update mongoose connection for newer versions
mongoose.connect(mongo_uri)
    .then(() => {
        console.log("MongoDB Connection Completed");
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err);
    });

client.invite = new Map();

//Commands handlers prerequisits
client.commands = new Collection();
client.SlashCommands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
client.cooldowns = new Collection();
//reading dir for handlers
["slash", "command", "events"].forEach((handlers) => {
    require(`./handlers/${handlers}`)(client); //getting handler code from handlers folder
});

client.login(token); //login

/*
Copyright (C) 2022  Major Senpai スレーブマスター#7814, Julio_#7057, and Noro#4477

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.
*/
