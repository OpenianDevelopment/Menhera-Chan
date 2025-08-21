const { addXP } = require('../../function/dbfunctions');
const Discord = require('discord.js')
const level = require('./level');
module.exports = {
    name: 'givelevel',
    category: 'ranks',
    description: 'to give level to user',
    usage: '<user> <level>',
    args: true,
    role: 'MenheraMod',
    permission: 'MANAGE_CHANNELS',
    run: async (client, message, args) => {
        var member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        if (!member.user) return message.channel.send('Please mention a user');
        if (isNaN(args[1])) return message.channel.send('Level should be a number');
        var level = parseInt(args[1]);
        if (level > 1500 || level < 0) return message.channel.send('Level should be between 0 and 1500')

        var xp = (level * level) / 0.01;

        maxxp = ((level + 1) * (level + 1)) / 0.01;

        await addXP(message.guild.id, member.user.id, xp, level, xp, maxxp);
        const givenLevel = new EmbedBuilder()
            .setDescription(`${level} level has been set for ${member}`)
        message.channel.send({ embeds: [givenLevel] })

        const levelup = new EmbedBuilder()
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor('#7289DA')
            .addFields({ name: 'Congratulations', value: `You have reached Level ${level}` })
            .setFooter({ text: `${message.guild.name} | https://menhera-chan.tk ` })

        if (message.guild.botSetting.xplog === null) {
            message.channel.send(`${member}, Congratulations!`);
            message.channel.send({ embeds: [levelup] })
            return;
        }
        var log = message.guild.channels.cache.find(channel => channel.id === message.guild.botSetting.xplog);
        if (!log) return;
        log.send(`${member}, Congratulations!`)
        log.send(levelup)





    }

}