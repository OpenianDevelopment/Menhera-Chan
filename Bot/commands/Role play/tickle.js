const Discord = require("discord.js");
const { Rp } = require('../../function/dbfunctions')

module.exports = {
    name: 'tickle',
    description: 'To tickle someone',
    usage: '<user> [text]',
    category: 'Role play',
    args: true,
    run: async (client, message, args, con, rcon) => {
        const member = message.mentions.members.first();
        let text = `~ ${args.slice(1).join(" ")}`;
        var data = await Rp(`tickle`)
        data = data[Math.floor(Math.random() * data.length)]
        if (!member)
            return message.reply(`Please mention a user to \`tickle\` them *heh*`);

        const rtxt = [
            `**${message.author.username} *tickles* ${member.user.username}**`,
            `**${message.author.username} *tickles* ${member.user.username} tehehe**`,
            `**${message.author.username} *tickles* ${member.user.username}!! Hehe!**`,
        ];
        let rtext = rtxt[Math.floor(Math.random() * rtxt.length)];
        if (member.id === message.author.id)
            rtext = `Ummm...Uhhhh... ${message.author} *tickles* themselves..`;

        let embed = new Discord.MessageEmbed()
            .setDescription(`${rtext} ${text}`)
            .setImage(data.get(`img`))
            .setFooter(`RP id: ${data.get(`_id`)}`)
        return message.channel.send(embed);
    }
}