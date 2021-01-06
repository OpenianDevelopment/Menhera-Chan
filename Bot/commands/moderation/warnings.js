const {getWarn} = require('../../function/dbfunctions');
const Discord = require('discord.js');
module.exports = {
    name: 'warnings',
    category: 'moderation',
    description: 'To get warn list of a user',
    usage: '<user>',
    args: true,
    permission: 'MANAGE_MESSAGES',
    run: async (client,message,args)=>{
        var member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        if(!member.user) return message.channel.send('User not found');
        var warnings = await getWarn(message.guild.id,member.user.id)
        const WarnEmbed = new Discord.MessageEmbed()
                                .setAuthor(`${member.user.username} has ${warnings.length} warns logged`,member.user.displayAvatarURL())
                                .setColor(`RED`)
                                .setTimestamp();
        
        warnings.forEach(warn=>{
            var mod = message.guild.member(warn.mod)
            WarnEmbed.addField(`${warn._id} | Moderator: ${mod.user.username} `,`${warn.warn} - ${warn.date}`)
        })

        message.channel.send(WarnEmbed);
    }
}