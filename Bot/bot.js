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

