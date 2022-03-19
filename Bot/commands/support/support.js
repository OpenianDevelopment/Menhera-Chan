const Discord = require('discord.js')
module.exports = {
    name: 'support',
    description: 'General Support',
    category: 'support',
    run: (client, message, args, con, rcon) => {
        const embed = new Discord.MessageEmbed()
            .setTitle('Support')
            .addField('Developer Team: ', '<@180485886184521728> <@534783899331461123> <@687893451534106669>')
            .addField('Official Server:', 'https://discord.gg/GkNMFmQ')


        message.channel.send(embed);

    }
}