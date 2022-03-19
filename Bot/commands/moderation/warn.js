const Discord = require('discord.js');
const globalFunc = require('../../function/functions')
const { sendModLog } = require('../../function/functions')
const { addWarn } = require('../../function/dbfunctions')
module.exports = {
    name: 'warn',
    description: 'Issue a Warn',
    category: 'moderation',
    usage: '<user> [reason]',
    permission: 'MANAGE_MESSAGES',
    args: true,
    run: async (client, message, args) => {
        //Getting member from the args[0] mention or ID
        var member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        if (!member.user) return message.channel.send('User not found'); //If user is not found
        var reason = args.slice(1).join(" "); //eliminating mention of user and adding rest as reason
        if (!reason) return message.channel.send("Please provide a warning reason"); //return if reason is not provided
        //Creating Embed to send to the member
        const MemberEmbed = new Discord.MessageEmbed()
            .setTitle('Warning')
            .setColor('RED')
            .setDescription(`You have been warned in \`\`${message.guild.name}\`\``)
            .addField('Reason', reason)
            .setTimestamp()
        //Creating Embed for informming moderator
        const ModEmbed = new Discord.MessageEmbed()
            .setTitle(`\`\`${member.user.tag}\`\` Warned`)
            .setColor('RED')
            .addField('Reason:', reason)
            .setTimestamp()
        //getting date in much cleaner format (Week Date Month Year)
        var date = globalFunc.getDate()
        //adding warning to db
        addWarn(message.guild.id, member.user.id, reason, message.author.id, date);
        //sending message to the member and catching error in case DM Closed.
        member.send(MemberEmbed).catch(err => {
            message.channel.send(`${member} not warned. Warning logged`);
        });
        message.channel.send(ModEmbed); //sending info in channel
        //adding mod detail for sending to modlogs
        ModEmbed.addField('Moderator', message.author);
        sendModLog(message, message.guild.botSetting.logchannel, `Warn`, null, member, reason, message.author, client)
    }
}