const Discord = require('discord.js');
const { sendModLog } = require('../../function/functions')
module.exports = {
    name: 'ban',
    description: 'bans a member',
    category: 'Moderation',
    usage: '<user> [reason]',
    permission: 'BAN_MEMBERS',
    botPermission: 'BAN_MEMBERS',
    args: true,
    run: async (client, message, args) => {
        var member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        if (!member.user) return message.channel.send('User not found');
        if (!member.bannable) return message.channel.send('You can\'t ban this user');
        let reason = args.slice(1).join(' ');
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Banned`, member.user.displayAvatarURL())
            .setColor('RED')
            .setDescription(`You have been Banned from \`\`${message.guild.name}\`\``)

        const embed1 = new Discord.MessageEmbed()
            .setAuthor(`Banned`, member.user.displayAvatarURL())
            .setColor('RED')
            .setDescription(`${member.user.username} have been Banned`)
            .addField('Banned by', message.author, true)

        if (reason) {
            embed.addField('Reason', `${reason}`)
            embed1.addField('Reason', `${reason}`)
        }
        else {
            embed.addField('Reason', `No Reason Given.`)
            embed1.addField('Reason', `No Reason Given.`)
        }
        message.channel.send(embed1)
        member.send(embed).catch(function (err) {
            message.channel.send("Coudn't send user the reason. Reason logged")
        })

        member.ban({ reason: reason })

        sendModLog(message, message.guild.botSetting.logchannel, `Ban`, message.channel.id, member, reason, message.author, client)
    }
}