const Discord = require('discord.js')
module.exports = {
    name: 'avatar',
    aliases: ["av"],
    category: 'general',
    description: 'To get avatar',
    usage: '[user]',
    run: async (client, message, args) => {
        var member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        if (!member.user) {
            member = message.member
        }

        const embed = new Discord.MessageEmbed()
            .setImage(member.user.displayAvatarURL({ dynamic: true }))

        message.channel.send(embed)
    }
}