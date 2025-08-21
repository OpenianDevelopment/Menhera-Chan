const { EmbedBuilder } = require('discord.js');
const globalFunc = require('../../function/dbfunctions');

module.exports = {
    name: 'dailycoins',
    description: 'get daility coins',
    category: 'general',
    args: false,
    run: async (client, message, args) => {
        client.commands.get('vote').run(client, message, args)
    }
}