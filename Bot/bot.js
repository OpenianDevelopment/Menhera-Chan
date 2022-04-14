//Requirements
const { Client, Collection } = require("discord.js");
const mongoose = require("mongoose");
const client = new Client({ partials: ["MESSAGE", "REACTION", "CHANNEL"], ws: { version: 7 } });
const fs = require("fs");
const { token, mongo_uri } = require("./botconfig.json");
const mongoid = mongo_uri;

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


mongoose.connect(
    mongoid,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    (err) => {
        if (err) throw err;
        console.log("Connection Completed");
    }
);

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
