const Discord = require("discord.js");
const { Rp } = require('../../function/dbfunctions')

module.exports = {
    name: 'yeet',
    description: 'To yeet someone',
    usage: '<user> [text]',
    category: 'Role play',
    args: true,
    run: async (client, message, args, con, rcon) => {
        const member = message.mentions.members.first();
        let text = `~ ${args.slice(1).join(" ")}`;
        var data = await Rp(`yeet`)
        data = data[Math.floor(Math.random() * data.length)]
        if (!member)
            return message.reply(`Please mention a user to \`YEET!!\` them <a:tenor:735278923407032410>`);

        const rtxt = [
            `**OOF ${member.user.username} flied away**`,
            `**Ouch looks like it hurts!**`,
            `**\`${message.author.username}\` killed \`${member.user.username}\` With great fall damage**`,
            `**${message.author.username} regrets yeeting ${member.user.username}** \\😢`
        ];

        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];

        if (member.id === message.author.id)
            rtext = `${message.author} Yeeted themself`;

        let embed = new Discord.MessageEmbed()
            .setDescription(`${rtext} ${text}`)
            .setImage(data.get(`img`))
            .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}