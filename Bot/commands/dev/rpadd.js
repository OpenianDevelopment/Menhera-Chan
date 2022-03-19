const Discord = require('discord.js');
const globalFunc = require('../../function/dbfunctions');

module.exports = {
    name: 'rpadd',
    description: 'to add rp pics',
    usage: '[mod] (url)',
    category: 'dev',
    args: true,
    run: async (client, message, args) => {
        var data = await globalFunc.bl(message.author.id, "dev")
        if (data == null) return message.channel.send(`You're not a developer`)
        for (var i = 1; i < args.length; i++) {
            await globalFunc.RpADD(args[0], args[i])
        }
        message.channel.send(`added to db`)
    }
}