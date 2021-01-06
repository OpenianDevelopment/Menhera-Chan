const Discord = require('discord.js');
const globalFunc = require('../../function/dbfunctions');
module.exports = {
    name: 'blacklist',
    description: 'to blacklist users/guilds',
    aliases: ["bl"],
    usage: '<mod> <+/-> <id>',
    category:'dev',
    args: true,
    run:async(client,message,args)=>{
        var data = await globalFunc.bl(message.author.id,`dev`)
        if(data == null)return message.channel.send(`You're not a developer`)
            let reason = args.slice(3).join(' ');
            if(!reason)
            reason = `No Given Reason`;
            if(args[1] === '+') {
                globalFunc.blADD(args[2],args[0])
                const embed1 = new Discord.MessageEmbed()
                                .setTitle('Blacklist Add')
                                .setDescription(`<@!${args[2]}> was added to blacklist`)
                                .addField(`reason:`, `${reason}`);
                message.channel.send(embed1);
            } else if(args[1] === '-') {
                globalFunc.blDROP(args[2],args[0])
                const embed2 = new Discord.MessageEmbed()
                                .setTitle('Blacklist Remove')
                                .setDescription(`<@!${args[2]}> was removed from blacklist`)
                                .addField(`reason:`, `${reason}`);
                message.channel.send(embed2);
            }
        }
    }