const Discord = require('discord.js')
const { removeModeration } = require('../../function/dbfunctions');
const { sendModLog } = require('../../function/functions')
module.exports = {
    name: 'unmute',
    category: 'moderation',
    description: 'to unmute muted users',
    usage: '<user>',
    permission: 'MANAGE_MESSAGES',
    botPermission: 'MANAGE_ROLES',
    args: true,
    run: async (client, message, args, con) => {
        var member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        var roleid = await message.guild.botSetting.muterole;
        if (!member.user) return message.channel.send("No user found")
        if (!member.roles.cache.has(roleid)) return message.channel.send("User is not muted")

        member.roles.remove(roleid)
        removeModeration(message.guild.id, member.user.id, 'mute')
        const embed = new Discord.MessageEmbed()
            .setTitle('Unmute')
            .setColor('GREEN')
            .setDescription(`You have been Unmuted`)
            .addField(`By`, message.author)
        member.send(embed).catch(function (err) {
            console.log('DM closed')
        })
        const embed2 = new Discord.MessageEmbed()
            .setTitle('Unmute')
            .setColor('GREEN')
            .setDescription(`${member.user.username} have been Unmuted`)
            .addField(`By`, message.author)
        message.channel.send(embed2);
        sendModLog(message, message.guild.botSetting.logchannel, `Unmute`, null, member, null, null, client)
    }
}