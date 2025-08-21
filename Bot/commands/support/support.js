const Discord = require('discord.js')
module.exports = {
    name: 'support',
    description: 'General Support',
    category: 'support',
    run: (client, message, args, con, rcon) => {
        const embed = new EmbedBuilder()
            .setTitle('Support')
            .addFields({ name: 'Developer Team: ', value: '<@180485886184521728> <@534783899331461123> <@687893451534106669>' })
            .addFields({ name: 'Official Server:', value: 'https://discord.gg/GkNMFmQ' })


        message.channel.send({ embeds: [embed] });

    }
}