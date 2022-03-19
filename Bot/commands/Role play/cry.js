const Discord = require("discord.js");
const { Rp } = require('../../function/dbfunctions')

module.exports = {
    name: 'cry',
    description: 'To cry!',
    category: 'Role play',
    args: false,
    run: async (client, message, args) => {
        let text = `~ ${args.join(" ")}`;
        var data = await Rp(`cry`)
        data = data[Math.floor(Math.random() * data.length)]

        const rtxt = [
            `**${message.author.username} *cries***`,
            `someone give **${message.author.username}** a hug`,
            `**${message.author.username} is crying :c**`,
        ];
        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];

        let embed = new Discord.MessageEmbed()
            .setDescription(`${rtext} ${text}`)
            .setImage(data.get(`img`))
            .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}