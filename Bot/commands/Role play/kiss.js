const Discord = require("discord.js")
const { Rp } = require('../../function/dbfunctions')

module.exports = {
    name: 'kiss',
    description: 'To kiss someone',
    usage: '<user> [text]',
    category: 'Role play',
    args: true,
    run: async (client, message, args, con, rcon) => {
        const member = message.mentions.members.first();
        let text = `~ ${args.slice(1).join(" ")}`;
        var data = await Rp(`kiss`)
        data = data[Math.floor(Math.random() * data.length)]
        if (!member)
            return message.reply(`Please mention a user to \`kiss\` them `);

        const rtxt = [
            `**Your lovey dovey ${message.author.username} *kissed* ${member.user.username}**`,
            `***KISS***`
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];
        if (member.id === message.author.id)
            rtext = `${message.author} kissed themself \`how lonely\``;

        let embed = new Discord.MessageEmbed()
            .setDescription(`${rtext} ${text}`)
            .setImage(data.get(`img`))
            .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}