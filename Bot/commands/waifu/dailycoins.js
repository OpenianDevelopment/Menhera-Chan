const Discord = require('discord.js');;
const globalFunc = require('../../function/dbfunctions');
const DBL = require("dblapi.js");

module.exports = {
    name: 'dailycoins',
    description: 'get daility coins',
    category: 'general',
    args: false,
    run: async (client, message, args) => {
        client.commands.get('vote').run(client, message, args)
    }
}