const Discord = require('discord.js');
const { removeWarn } = require('../../function/dbfunctions');
const { sendModLog } = require('../../function/functions')
module.exports = {
    name:'delwarn',
    category:'moderation',
    description: 'To delete warn from log',
    usage: '<warn ID>',
    permission: 'MANAGE_MESSAGES',
    args: true,
    run: (client,message,args)=>{
        var re = removeWarn(message.guild.id,args[0]);
        if(re == false)return message.channel.send(`This is not a proper id.`)
        const embed = new Discord.MessageEmbed()
                            .setTitle('Warning Removed')
                            .setTimestamp()
                            .setColor('GREEN')

        message.channel.send(embed);
        sendModLog(message,message.guild.botSetting.logchannel,`Delwarn`,null,null,null,args[0],client)
    }
}