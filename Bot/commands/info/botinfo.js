const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: 'botinfo',
    aliases: ["bot", "stats"],
    description: 'Gives the stats and info about the bot',
    category:'info',
    run:async(client,message,args,con,rcon)=>{
        const duration = moment.duration(client.uptime).format("D [days], H [hrs], m [mins], s [secs]");

        let statsE = new Discord.MessageEmbed()
        .setTitle(`**${client.user.username}'s Info**`)
        .addField("**Uptime**", `**${duration}**`)
        .addField(`Language`, `English`)
        .addField(`Bot Version`, `1.0`)
        .addField(`Programming Language`, `JavaScript`)
        .addField(`Discord.js Version`, `12.2.0`)
        .addField(`Node Version`, `12.14.1`)
        .addField(`Owners`, `<@180485886184521728>\n<@534783899331461123>\n<@687893451534106669>`)
        .setTimestamp()
        .setFooter(``, client.user.displayAvatarURL());

        message.channel.send(statsE)
    }
} 