const Discord = require('discord.js');
const { sendModLog } = require('../../function/functions')
module.exports = {
    name: 'kick',
    description: 'kick a user',
    category: 'moderation',
    usage: '<user> [reason]',
    permission: 'KICK_MEMBERS',
    botPermission: 'KICK_MEMBERS',
    args: true,
    run: async (client, message, args) => {
        //Getting member from the args[0] mention or ID
        var member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        if (!member.user) return message.channel.send('User not found'); //If user is not found
        if (member.hasPermission('KICK_MEMBERS')) return message.channel.send('I can\'t kick this user')
        var reason = args.slice(1).join(" "); //eliminating mention of user and adding rest as reason
        if (!reason) reason = 'No Reason Given.'
        //Creating Embed to send to the member
        const MemberEmbed = new Discord.MessageEmbed()
            .setTitle('Kicked')
            .setColor('RED')
            .setDescription(`You have been Kicked from \`\`${message.guild.name}\`\``)
            .addField('Reason', reason)
        //Creating Embed for informming moderator
        const ModEmbed = new Discord.MessageEmbed()
            .setTitle(`\`\`${member.user.tag}\`\` Kicked`)
            .setColor('RED')
            .addField('Reason:', reason)

        //sending message to the member and catching error in case DM Closed.
        message.channel.send(ModEmbed); //sending info in channel
        member.send(MemberEmbed).catch(err => {
            message.channel.send('User kicked. Cound\'t send user Reason')
        })
        member.kick(reason)

        //adding mod detail for sending to modlogs
        ModEmbed.addField('Moderator', message.author);
        sendModLog(message, message.guild.botSetting.logchannel, `Kick`, null, member, reason, message.author, client)

    }
}