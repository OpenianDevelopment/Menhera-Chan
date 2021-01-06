const Discord = require('discord.js');
const { sendModLog } = require('../../function/functions')
const { removeModeration } = require('../../function/dbfunctions')
module.exports = {
    name: 'unban',
    description: 'Unbans a user from the guild',
    category:'moderation',
    usage: '<user id>',
    permission: 'BAN_MEMBERS',
    botPermission: 'BAN_MEMBERS',
    args: true,
    run:async(client,message,args)=>{
        var member = args[0]
        
        var ban = await message.guild.fetchBans();
        var member = ban.get(member);
        if(!member) return message.channel.send('This member is not banned')
        await message.guild.members.unban(member.user.id)
            const embed1 = new Discord.MessageEmbed()
                            .setTitle(`Unbanned`,)
                            .setColor('GREEN')
                            .setDescription(`${member.user.username} have been Unbanned`)
                            .addField('Unbanned by', message.author, true)
                            .setTimestamp()
            message.channel.send(embed1);
            removeModeration(message.guild.id,args[0],'ban')
            sendModLog(message,message.guild.botSetting.logchannel,`Unban`,null,args[0],null,null,client)
        
       
            
    }
}