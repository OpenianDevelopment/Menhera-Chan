const Discord = require("discord.js");
const { Rp } = require('../../function/dbfunctions')

module.exports = {
    name: 'highfive',
    description: 'To high-five with someone',
    aliases: ["high-five"],
    usage: '<user> [text]',
    category: 'Role play',
    args: true,
    run: async (client, message, args, con, rcon) => {
        const member = message.mentions.members.first();
        let text = `~ ${args.slice(1).join(" ")}`;
        var data = await Rp(`highfive`)
        data = data[Math.floor(Math.random() * data.length)]
        if (!member)
            return message.reply(`Please mention a user to \`high-five\` them?`);

        const rtxt = [
            `***best mates***`,
            `**${message.author.username}: *high-five***`
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];

        if (member.id === message.author.id)
            return message.reply(`You can't do that!`);

        let embed = new Discord.MessageEmbed()
            .setDescription(`${rtext} ${text}`)
            .setImage(data.get(`img`))
            .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}