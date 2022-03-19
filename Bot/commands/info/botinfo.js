const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: 'botinfo',
    aliases: ["bot", "stats"],
    description: 'Gives the stats and info about the bot',
    category: 'info',
    run: async (client, message, args, con, rcon) => {
        const duration = moment.duration(client.uptime).format("D [days], H [hrs], m [mins], s [secs]");

        let statsE = new Discord.MessageEmbed()
            .setTitle(`**${client.user.username}'s Info**`)
            .addField("**Uptime**", `**${duration}**`)
            .addField(`Language`, `English`)
            .addField(`Bot Version`, `1.0`)
            .addField(`Programming Language`, `JavaScript`)
            .addField(`Discord.js Version`, require("../../../package.json")["dependencies"]['discord.js'].replace("^", " "))
            .addField(`Node Version`, process.version)
            .addField(`Owners`, `<@180485886184521728>(Julio_#7057)\n<@534783899331461123>(Noro#4477)\n<@687893451534106669>(Major Senpai スレーブマスター#7814)`)
            .setTimestamp()
            .setFooter(``, client.user.displayAvatarURL());

        message.channel.send(statsE)
    }
} 