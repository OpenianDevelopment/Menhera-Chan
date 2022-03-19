const Discord = require('discord.js');
const ms = require('ms');
const { sendModLog } = require('../../function/functions')
module.exports = {
    name: 'slowmode',
    description: 'To set the slowmode of the channel the command is written in',
    category: 'moderation',
    permission: 'MANAGE_CHANNELS',
    botPermission: 'MANAGE_CHANNELS',
    args: true,
    run: async (client, message, args) => {
        //check if args is a number or not
        if (!isNaN(args)) return message.channel.send(`"${args}" Is Not A Number.\n ending task`)
        var time = parseInt(args);//getting time in int format
        //checking limit
        if (time < 0 || time > 100) return message.channel.send('Time should be between 0 and 100')
        //applying slowmode
        message.channel.edit({ rateLimitPerUser: time })
        //sending message
        message.channel.send(`The Channel is now in slowmode with ${time} second`)
        sendModLog(message, message.guild.botSetting.logchannel, `slowmode`, message.channel.id, null, null, `${time} Seconds`, client)
    }
}