const {getModeration} = require('../../function/dbfunctions');
const { getTime } = require('../../function/functions')
const Discord = require('discord.js');
module.exports = {
    name: 'moderations',
    category: 'moderation',
    description: 'To get the current active moderations',
    permission: 'MANAGE_MESSAGES',
    run: async (client,message,args)=>{
        
        var mod = await getModeration(message.guild.id)
        const ModerationEmbed = new Discord.MessageEmbed()
                                .setTitle('Moderations')
                                .setTimestamp()
        var String='';
        mod.moderations.forEach(mod=>{
            var time = mod.time - Date.now();
            var time = getTime(time);
            var member = message.guild.members.fetch(mod.user)
            if(member.user){
                String+= `${member.user.username} | ${mod.modtype} | ${time} \n`
            }
            
        })
        ModerationEmbed.setDescription(String);
        message.channel.send(ModerationEmbed);
    }
}