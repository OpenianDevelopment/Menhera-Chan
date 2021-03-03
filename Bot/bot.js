//Requirements
const {Client, Collection} = require('discord.js');

const client = new Client();
const fs = require('fs');
const {token} = require('./botconfig.json')
client.invite = new Map()
client.queue = new Map()
//Commands handlers prerequisits
client.commands = new Collection();
client.SlashCommands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands/');
client.cooldowns = new Map();
//reading dir for handlers
['slash','command','events'].forEach(handlers=>{
    require(`./handlers/${handlers}`)(client); //getting handler code from handlers folder
});


client.login(token) //login

/*
Copyright (C) 2021  Major Senpai スレーブマスター#1091, Julio_#7057, and Noro#4477

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.
*/
