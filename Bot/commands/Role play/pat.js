const Discord = require("discord.js")
const { Rp } = require('../../function/dbfunctions')

module.exports = {
    name: `pat`,
    description: 'To pat someone',
    usage: '<user> [text]',
    category: 'Role play',
    args: true,
    run: async (client, message, args, con, rcon) => {
        const member = message.mentions.members.first();
        let text = `~ ${args.slice(1).join(" ")}`;
        var data = await Rp(`pat`)
        data = data[Math.floor(Math.random() * data.length)]
        if (!member)
            return message.reply(`Please mention a user to \`pat\` them`);

        const rtxt = [
            `**${message.author.username} pats ${member.user.username}**`,
            `**${message.author.username} feel sorry for ${member.user.username} so they patted them**`,
            `**${member.user.username} died from extrem cutness of ${message.author.username}**`
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];

        if (member.id === message.author.id)
            rtext = `Oh... ${message.author} pats ${message.author} !!??`;

        let embed = new Discord.MessageEmbed()
            .setDescription(`${rtext} ${text}`)
            .setImage(data.get(`img`))
            .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}